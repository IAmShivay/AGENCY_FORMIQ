import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { emailService } from '@/lib/emailService';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabaseAuth = createRouteHandlerClient({ cookies } as any);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      quotationId, 
      recipientEmail, 
      recipientName, 
      customMessage,
      includePDF = true 
    } = body;

    if (!quotationId || !recipientEmail || !recipientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch quotation data
    const { data: quotation, error } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', quotationId)
      .single();

    if (error || !quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    let pdfBuffer: Buffer | undefined;

    if (includePDF) {
      // Generate PDF (simplified version for server-side)
      const pdf = new jsPDF();
      
      // Add content to PDF
      pdf.setFontSize(16);
      pdf.text('Digital Solutions & Marketing Agency', 20, 30);
      pdf.setFontSize(10);
      pdf.text('Email: hello@formiqstudio.in | Phone: +91 8918349445 | WhatsApp: +1 555-341-9743', 20, 40);
      
      pdf.setFontSize(16);
      pdf.text(`Quotation: ${quotation.quotation_number}`, 20, 60);
      
      pdf.setFontSize(12);
      pdf.text(`Client: ${quotation.client_name}`, 20, 80);
      pdf.text(`Project: ${quotation.project_title}`, 20, 90);
      pdf.text(`Total Amount: ₹${quotation.total_amount.toLocaleString('en-IN')}`, 20, 100);
      
      // Add items
      let yPosition = 120;
      pdf.text('Services:', 20, yPosition);
      yPosition += 10;
      
      if (quotation.items && Array.isArray(quotation.items)) {
        quotation.items.forEach((item: any, index: number) => {
          pdf.text(`${index + 1}. ${item.description} - ₹${item.amount.toLocaleString('en-IN')}`, 25, yPosition);
          yPosition += 10;
        });
      }
      
      // Add terms
      if (quotation.terms_conditions) {
        yPosition += 10;
        pdf.text('Terms & Conditions:', 20, yPosition);
        yPosition += 10;
        
        const terms = quotation.terms_conditions.split('\n');
        terms.forEach((term: string) => {
          if (term.trim()) {
            pdf.text(term, 20, yPosition);
            yPosition += 8;
          }
        });
      }
      
      pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    }

    // Send email
    const success = await emailService.sendQuotationEmail(
      recipientEmail,
      recipientName,
      quotation.quotation_number,
      customMessage || '',
      pdfBuffer
    );

    if (success) {
      // Update quotation status to 'sent' if it was 'draft'
      if (quotation.status === 'draft') {
        await supabase
          .from('quotations')
          .update({ status: 'sent' })
          .eq('id', quotationId);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Quotation sent successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending quotation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
