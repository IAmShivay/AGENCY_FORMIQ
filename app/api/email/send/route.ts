import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email/index';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * API route to send an email (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const supabaseAuth = createRouteHandlerClient({ cookies } as any);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, message, messageId, replyTo } = await req.json();

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendEmail({
      to,
      subject,
      text: message,
      from: process.env.SMTP_FROM || 'contact@formiqstudio.com',
      replyTo: replyTo || process.env.SMTP_FROM || 'contact@formiqstudio.com'
    });

    // If this is a reply to a contact message, update its status
    if (messageId) {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'replied' })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
      }
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in email API route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
