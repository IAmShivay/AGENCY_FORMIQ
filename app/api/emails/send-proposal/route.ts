import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendProposalEmail, getEmailTemplates } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, proposalId, templateId, includePdf = true } = body;

    if (!leadId || !proposalId) {
      return NextResponse.json(
        { error: 'Lead ID and Proposal ID are required' },
        { status: 400 }
      );
    }

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Fetch proposal data
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(user_id)
      `)
      .eq('id', proposalId)
      .eq('leads.user_id', user.id)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Generate PDF content if requested
    let pdfContent: string | undefined;
    if (includePdf && proposal.content) {
      try {
        const proposalContent = JSON.parse(proposal.content);
        // Here you would generate actual PDF content
        // For now, we'll use HTML content that can be converted to PDF
        pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${proposalContent.title || 'Proposal'}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #F97316 100%); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h2 { color: #8B5CF6; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px; }
        .pricing-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .pricing-table th, .pricing-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .pricing-table th { background: #f8fafc; }
        .total-row { background: #8B5CF6; color: white; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FormiqStudio</h1>
        <p>Digital Marketing & Development Agency</p>
    </div>
    
    <div class="section">
        <h1>${proposalContent.title || 'Software Development Proposal'}</h1>
        <p><strong>Prepared for:</strong> ${lead.name}, ${lead.company || 'Your Company'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>${proposalContent.executiveSummary || 'Custom software development proposal'}</p>
    </div>
    
    <div class="section">
        <h2>Investment Breakdown</h2>
        <table class="pricing-table">
            <thead>
                <tr>
                    <th>Phase</th>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${(proposalContent.pricingBreakdown || []).map((item: any) => `
                    <tr>
                        <td>${item.phase}</td>
                        <td>${item.description}</td>
                        <td>${item.hours}</td>
                        <td>$${item.rate}/hr</td>
                        <td>$${item.amount.toLocaleString()}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="4"><strong>Total Investment</strong></td>
                    <td><strong>$${proposal.total_amount?.toLocaleString() || 'TBD'}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>Contact Information</h3>
        <p><strong>FormiqStudio</strong><br>
        Email: hello@formiqstudio.com<br>
        India: +91 8918349445<br>
        USA: +1 224-523-8210<br>
        Website: www.formiqstudio.com</p>
    </div>
</body>
</html>
        `;
      } catch (error) {
        console.error('Error generating PDF content:', error);
      }
    }

    // Send the email
    const success = await sendProposalEmail(
      lead,
      proposal,
      templateId,
      pdfContent
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update proposal status
    await supabase
      .from('proposals')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', proposalId);

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'proposal_sent' })
      .eq('id', leadId);

    return NextResponse.json({
      message: 'Proposal email sent successfully',
      success: true
    });

  } catch (error) {
    console.error('Error sending proposal email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send proposal email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies } as any);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get available email templates
    const templates = await getEmailTemplates();

    return NextResponse.json({ templates });

  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
