/**
 * PaymentService Interface
 * Base interface for all payment gateway implementations
 */

export interface PaymentDetails {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  gatewayResponse?: any;
}

export interface PaymentService {
  /**
   * Create a payment intent/order
   */
  createPayment(details: PaymentDetails): Promise<{
    clientSecret?: string;
    orderId?: string;
    paymentId?: string;
    error?: string;
  }>;

  /**
   * Verify a payment was successful
   */
  verifyPayment(paymentId: string, data: any): Promise<PaymentResult>;

  /**
   * Process a webhook event from the payment gateway
   */
  handleWebhook(payload: any, signature: string): Promise<{
    status: string;
    orderId?: string;
    paymentId?: string;
  }>;
}

export default PaymentService;
