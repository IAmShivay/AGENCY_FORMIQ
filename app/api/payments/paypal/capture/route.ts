import { NextRequest, NextResponse } from 'next/server';
import { PayPalService } from '@/lib/services/payment';

/**
 * API route to capture a PayPal payment
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const result = await PayPalService.verifyPayment(orderId, {});

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // In a real implementation, we would update the order status in the database
    console.log(`Payment successful for PayPal order ${orderId}`);

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId
    });
  } catch (error: any) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture payment' },
      { status: 500 }
    );
  }
}
