import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || 'formiq_welcome';
const WHATSAPP_TEMPLATE_LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en';

export async function POST(req: NextRequest) {
  try {
    const { phone, name, service } = await req.json();

    if (!phone || !name) {
      return NextResponse.json({ error: 'phone and name required' }, { status: 400 });
    }

    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      console.log('WhatsApp Cloud API not configured, skipping');
      return NextResponse.json({ success: true, skipped: true });
    }

    // Clean phone — ensure it has country code 91
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    if (!cleanPhone.startsWith('91')) cleanPhone = '91' + cleanPhone;

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'template',
          template: {
            name: WHATSAPP_TEMPLATE_NAME,
            language: { code: WHATSAPP_TEMPLATE_LANG },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: name },
                ],
              },
            ],
          },
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('WhatsApp Cloud API error:', result);
      return NextResponse.json(
        { success: false, error: result.error?.message || 'Send failed' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, messageId: result.messages?.[0]?.id });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json({ error: 'Failed to send WhatsApp' }, { status: 500 });
  }
}
