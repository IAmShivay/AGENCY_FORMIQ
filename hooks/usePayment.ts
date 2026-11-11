import { useState } from 'react';

interface PaymentDetails {
  amount: number;
  orderId: string;
  description?: string;
  currency?: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface PaymentHookResult {
  isLoading: boolean;
  error: string | null;
  processStripePayment: (details: PaymentDetails) => Promise<{ clientSecret: string } | null>;
  processPayPalPayment: (details: PaymentDetails) => Promise<{ orderId: string } | null>;
  processRazorpayPayment: (details: PaymentDetails) => Promise<{ orderId: string } | null>;
  verifyRazorpayPayment: (paymentData: any) => Promise<boolean>;
}

/**
 * Custom hook for handling payments
 */
export function usePayment(): PaymentHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Process a payment with Stripe
   */
  const processStripePayment = async (details: PaymentDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: details.amount,
          orderId: details.orderId,
          description: details.description,
          currency: details.currency || 'usd'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return { clientSecret: data.clientSecret };
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Process a payment with PayPal
   */
  const processPayPalPayment = async (details: PaymentDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: details.amount,
          orderId: details.orderId,
          description: details.description,
          currency: details.currency || 'USD'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order');
      }

      return { orderId: data.orderId };
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Process a payment with Razorpay
   */
  const processRazorpayPayment = async (details: PaymentDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: details.amount,
          orderId: details.orderId,
          description: details.description,
          currency: details.currency || 'INR',
          customerEmail: details.customerEmail,
          customerPhone: details.customerPhone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Razorpay order');
      }

      return { orderId: data.orderId };
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your payment');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify a Razorpay payment
   */
  const verifyRazorpayPayment = async (paymentData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      return data.verified;
    } catch (err: any) {
      setError(err.message || 'An error occurred while verifying your payment');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    processStripePayment,
    processPayPalPayment,
    processRazorpayPayment,
    verifyRazorpayPayment
  };
}
