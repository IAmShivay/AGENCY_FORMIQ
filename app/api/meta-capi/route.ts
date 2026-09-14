import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PIXEL_ID = '28091008350601343';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, email, phone, clientIp, userAgent, sourceUrl, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName required' }, { status: 400 });
    }

    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: 'CAPI not configured' }, { status: 500 });
    }

    const eventData: any = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: sourceUrl || 'https://formiqstudio.in',
      action_source: 'website',
      user_data: {
        client_ip_address: clientIp || req.headers.get('x-forwarded-for') || '',
        client_user_agent: userAgent || req.headers.get('user-agent') || '',
      },
    };

    if (email) eventData.user_data.em = [hashSHA256(email)];
    if (phone) eventData.user_data.ph = [hashSHA256(phone.replace(/\D/g, ''))];

    if (customData) {
      eventData.custom_data = customData;
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [eventData],
          access_token: ACCESS_TOKEN,
        }),
      }
    );

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('CAPI error:', error);
    return NextResponse.json({ error: 'CAPI failed' }, { status: 500 });
  }
}
