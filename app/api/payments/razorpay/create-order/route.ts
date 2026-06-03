import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/services/payment';

/**
 * API route to create a Razorpay order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, description, currency = 'INR', customerEmail, customerPhone } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const result = await RazorpayService.createPayment({
      amount,
      currency,
      orderId,
      description: description || `Payment for order ${orderId}`,
      customerEmail,
      customerPhone
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
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
