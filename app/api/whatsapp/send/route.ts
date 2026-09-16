import { NextRequest, NextResponse } from 'next/server';

const AISENSY_API_KEY = process.env.AISENSY_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { phone, name, service } = await req.json();

    if (!phone || !name) {
      return NextResponse.json({ error: 'phone and name required' }, { status: 400 });
    }

    if (!AISENSY_API_KEY) {
      console.log('AiSensy API key not configured, skipping WhatsApp');
      return NextResponse.json({ success: true, skipped: true });
    }

    // Clean phone number - ensure it starts with 91
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    if (!cleanPhone.startsWith('91')) cleanPhone = '91' + cleanPhone;

    const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: AISENSY_API_KEY,
        campaignName: 'formiq_welcome',
        destination: cleanPhone,
        userName: 'FormiqStudio',
        templateParams: [name, service || 'Growth Plan'],
        tags: ['website-lead'],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('AiSensy error:', result);
      return NextResponse.json({ success: false, error: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json({ error: 'Failed to send WhatsApp' }, { status: 500 });
  }
}
