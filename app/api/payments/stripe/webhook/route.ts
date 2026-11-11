import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/services/payment';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * API route to handle Stripe webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature') || '';

    const result = await StripeService.handleWebhook(body, signature);

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
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
