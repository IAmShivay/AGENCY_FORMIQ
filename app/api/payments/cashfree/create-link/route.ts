import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPaymentLink } from '@/lib/services/payment/CashfreeService';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { quotation_id } = await req.json();

    if (!quotation_id) {
      return NextResponse.json({ error: 'quotation_id required' }, { status: 400 });
    }

    // Fetch quotation
    const { data: quotation, error: qError } = await supabaseAdmin
      .from('quotations')
      .select('*')
      .eq('id', quotation_id)
      .single();

    if (qError || !quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const totalAmount = quotation.total_amount || quotation.subtotal || 0;

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid quotation amount' }, { status: 400 });
    }

    // Create Cashfree payment link
    const result = await createPaymentLink({
      quotation_id,
      quotation_number: quotation.quotation_number,
      amount: totalAmount,
      client_name: quotation.client_name || '',
      client_email: quotation.client_email || '',
      client_phone: quotation.client_phone || '',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Save payment link to quotation
    await supabaseAdmin
      .from('quotations')
      .update({
        payment_link: result.link_url,
        payment_link_id: result.link_id,
      })
      .eq('id', quotation_id);

    // Create payment record
    await supabaseAdmin.from('payments').insert({
      quotation_id,
      quotation_number: quotation.quotation_number,
      amount: totalAmount,
      currency: 'INR',
      status: 'pending',
      payment_link: result.link_url,
      payment_link_id: result.link_id,
      client_name: quotation.client_name,
      client_email: quotation.client_email,
      client_phone: quotation.client_phone,
      gateway: 'cashfree',
    });

    return NextResponse.json({
      success: true,
      payment_link: result.link_url,
      link_id: result.link_id,
    });
  } catch (error) {
    console.error('Create payment link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
