import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/services/payment';

/**
 * API route to create a Stripe payment intent
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, description, currency = 'usd' } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const result = await StripeService.createPayment({
      amount,
      currency,
      orderId,
      description: description || `Payment for order ${orderId}`
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentId: result.paymentId
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
