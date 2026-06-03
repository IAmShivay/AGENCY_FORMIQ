import { NextRequest, NextResponse } from 'next/server';
import { PayPalService } from '@/lib/services/payment';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * API route to handle PayPal webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headersList = await headers();
    const paypalHeaders = {
      'paypal-auth-algo': headersList.get('paypal-auth-algo') || '',
      'paypal-cert-url': headersList.get('paypal-cert-url') || '',
      'paypal-transmission-id': headersList.get('paypal-transmission-id') || '',
      'paypal-transmission-sig': headersList.get('paypal-transmission-sig') || '',
      'paypal-transmission-time': headersList.get('paypal-transmission-time') || ''
    };

    const result = await PayPalService.handleWebhook(body, JSON.stringify(paypalHeaders));

    if (result.status === 'success' && result.orderId) {
      // In a real implementation, we would update the order status in the database
      console.log(`Payment successful for order ${result.orderId}`);
      
      // You could trigger other actions here like:
      // - Sending confirmation emails
      // - Provisioning services
      // - Updating inventory
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling PayPal webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
