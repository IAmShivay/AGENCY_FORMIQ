import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';

function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!CASHFREE_SECRET_KEY) return true; // Skip in dev
  const expectedSignature = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(body)
    .digest('base64');
  return signature === expectedSignature;
}

async function sendPaymentReceipt(payment: any, quotation: any) {
  try {
    // Send receipt to client
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: payment.client_email,
        subject: `Payment Receipt - ${quotation.quotation_number}`,
        message: `Dear ${payment.client_name},\n\nThank you for your payment!\n\nPayment Details:\n- Quotation: ${quotation.quotation_number}\n- Amount: ₹${payment.amount.toLocaleString('en-IN')}\n- Transaction ID: ${payment.transaction_id}\n- Date: ${new Date().toLocaleDateString('en-IN')}\n\nYou can view your quotation at: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/quote/${quotation.id}\n\nThank you for choosing FormiqStudio!\n\nBest regards,\nFormiqStudio Team`,
        replyTo: 'hello@formiqstudio.in',
      }),
    });

    // Send notification to admin
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/api/email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'hello@formiqstudio.in',
        subject: `Payment Received - ${quotation.quotation_number} - ₹${payment.amount.toLocaleString('en-IN')}`,
        message: `Payment received!\n\nClient: ${payment.client_name}\nEmail: ${payment.client_email}\nQuotation: ${quotation.quotation_number}\nAmount: ₹${payment.amount.toLocaleString('en-IN')}\nTransaction ID: ${payment.transaction_id}\nGateway: Cashfree\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nView quotation: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/admin/quotations`,
        replyTo: payment.client_email,
      }),
    });
  } catch (error) {
    console.error('Failed to send payment receipts:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-cashfree-signature') || '';

    // Verify webhook signature
    if (CASHFREE_SECRET_KEY && !verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const eventType = payload.type;

    if (eventType === 'PAYMENT_LINK_EVENT') {
      const linkData = payload.data?.link_order;
      const linkId = linkData?.link_id;
      const linkStatus = linkData?.link_status;

      if (linkStatus === 'PAID' && linkId) {
        // Find payment by link ID
        const { data: payment } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('payment_link_id', linkId)
          .single();

        if (payment) {
          // Update payment status
          await supabaseAdmin
            .from('payments')
            .update({
              status: 'paid',
              transaction_id: linkData.cf_link_id?.toString() || '',
              paid_at: new Date().toISOString(),
              gateway_response: payload,
            })
            .eq('id', payment.id);

          // Update quotation status
          await supabaseAdmin
            .from('quotations')
            .update({ status: 'approved', payment_status: 'paid' })
            .eq('id', payment.quotation_id);

          // Fetch quotation for receipt
          const { data: quotation } = await supabaseAdmin
            .from('quotations')
            .select('*')
            .eq('id', payment.quotation_id)
            .single();

          if (quotation) {
            await sendPaymentReceipt(
              { ...payment, transaction_id: linkData.cf_link_id?.toString() },
              quotation
            );
          }
        }
      }
    } else if (eventType === 'ORDER_PAID') {
      const orderData = payload.data?.order;
      const paymentData = payload.data?.payment;
      const orderId = orderData?.order_id;

      if (orderId) {
        const { data: payment } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('payment_link_id', orderId)
          .single();

        if (payment) {
          await supabaseAdmin
            .from('payments')
            .update({
              status: 'paid',
              transaction_id: paymentData?.cf_payment_id?.toString() || '',
              paid_at: new Date().toISOString(),
              gateway_response: payload,
            })
            .eq('id', payment.id);

          await supabaseAdmin
            .from('quotations')
            .update({ status: 'approved', payment_status: 'paid' })
            .eq('id', payment.quotation_id);

          const { data: quotation } = await supabaseAdmin
            .from('quotations')
            .select('*')
            .eq('id', payment.quotation_id)
            .single();

          if (quotation) {
            await sendPaymentReceipt(
              { ...payment, transaction_id: paymentData?.cf_payment_id?.toString() },
              quotation
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cashfree webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
