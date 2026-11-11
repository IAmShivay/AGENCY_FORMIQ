import { NextRequest, NextResponse } from 'next/server';
import { RazorpayService } from '@/lib/services/payment';

/**
 * API route to verify a Razorpay payment
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, razorpayOrderId, razorpaySignature, orderId } = body;

    if (!paymentId || !razorpayOrderId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Payment details are incomplete' },
        { status: 400 }
      );
    }

    const result = await RazorpayService.verifyPayment(paymentId, {
      razorpayOrderId,
      razorpaySignature
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // In a real implementation, we would update the order status in the database
    console.log(`Payment successful for order ${orderId}`);

    return NextResponse.json({
      verified: true,
      transactionId: result.transactionId
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
