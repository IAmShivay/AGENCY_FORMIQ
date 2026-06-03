import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateProposal, generateProposalPDF, type ProposalData } from '@/lib/gemini';

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
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Fetch the lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Prepare data for proposal generation
    const proposalData: ProposalData = {
      leadName: lead.name,
      companyName: lead.company || 'Your Company',
      projectType: lead.project_type,
      budget: lead.budget || 'To be discussed',
      description: lead.description || 'Custom software development project',
      requirements: lead.requirements || [],
      timeline: 'To be discussed'
    };

    // Generate proposal using Gemini AI
    const generatedProposal = await generateProposal(proposalData);

    // Save the proposal to database
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        lead_id: leadId,
        title: generatedProposal.title,
        content: JSON.stringify(generatedProposal),
        pricing_breakdown: generatedProposal.pricingBreakdown,
        total_amount: generatedProposal.totalAmount,
        template_used: 'gemini_generated',
        status: 'draft'
      })
      .select()
      .single();

    if (proposalError) {
      console.error('Error saving proposal:', proposalError);
      return NextResponse.json({ error: 'Failed to save proposal' }, { status: 500 });
    }

    // Generate PDF content
    const pdfContent = await generateProposalPDF(generatedProposal, proposalData);

    return NextResponse.json({
      proposal: {
        ...proposal,
        generated_content: generatedProposal,
        pdf_content: pdfContent
      }
    });

  } catch (error) {
    console.error('Error generating proposal:', error);
    return NextResponse.json({ 
      error: 'Failed to generate proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Fetch proposals for the lead
    const { data: proposals, error } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(user_id)
      `)
      .eq('lead_id', leadId)
      .eq('leads.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }

    return NextResponse.json({ proposals });

  } catch (error) {
    console.error('Error in GET /api/proposals/generate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
