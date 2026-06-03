import { NextRequest, NextResponse } from 'next/server';
import { PayPalService } from '@/lib/services/payment';

/**
 * API route to create a PayPal order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, description, currency = 'USD' } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const result = await PayPalService.createPayment({
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
      orderId: result.orderId
    });
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
