import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
const WELCOME_TEMPLATE_ID = 1;

async function addToBrevo(email: string) {
  if (!BREVO_API_KEY || !BREVO_LIST_ID) return;

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [parseInt(BREVO_LIST_ID, 10)],
      updateEnabled: true,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    if (data.code === 'duplicate_parameter') return;
    console.error('Brevo contact error:', data.code, data.message);
  }
}

async function sendWelcomeEmail(email: string) {
  if (!BREVO_API_KEY) return;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId: WELCOME_TEMPLATE_ID,
      to: [{ email }],
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    console.error('Welcome email error:', data.code, data.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: normalizedEmail });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'You are already subscribed!' });
      }
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Newsletter signup is being set up. Please try again later.' },
          { status: 503 }
        );
      }
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    addToBrevo(normalizedEmail).catch((err) =>
      console.error('Brevo sync failed:', err)
    );

    sendWelcomeEmail(normalizedEmail).catch((err) =>
      console.error('Welcome email failed:', err)
    );

    return NextResponse.json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error in POST /api/newsletter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
