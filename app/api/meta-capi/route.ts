import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { META_PIXEL_ID } from '@/lib/meta-pixel';

const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';
const GRAPH_API_VERSION = 'v21.0';
const DEFAULT_SOURCE_URL = 'https://formiqstudio.in';
const ACTION_SOURCE = 'website';

function hashSHA256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, email, phone, sourceUrl, customData } = body;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName required' }, { status: 400 });
    }

    if (!ACCESS_TOKEN) {
      return NextResponse.json({ skipped: true, reason: 'META_CAPI_ACCESS_TOKEN not set' }, { status: 202 });
    }

    const clientIp = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const userData: Record<string, any> = {
      client_ip_address: clientIp || undefined,
      client_user_agent: req.headers.get('user-agent') || undefined,
      fbp: req.cookies.get('_fbp')?.value,
      fbc: req.cookies.get('_fbc')?.value,
    };

    if (email) userData.em = [hashSHA256(email)];
    if (phone) userData.ph = [hashSHA256(phone.replace(/\D/g, ''))];

    const eventData: Record<string, any> = {
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: sourceUrl || DEFAULT_SOURCE_URL,
      action_source: ACTION_SOURCE,
      user_data: userData,
    };

    if (customData) {
      eventData.custom_data = customData;
    }

    const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [eventData], access_token: ACCESS_TOKEN }),
    });

    const result = await response.json();
    return NextResponse.json({ success: response.ok, result }, { status: response.ok ? 200 : 502 });
  } catch (error) {
    console.error('CAPI error:', error);
    return NextResponse.json({ error: 'CAPI failed' }, { status: 500 });
  }
}
