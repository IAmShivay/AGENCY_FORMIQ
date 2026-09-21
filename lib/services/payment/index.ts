import type { PaymentService } from './PaymentService';
import StripeService from './StripeService';
import PayPalService from './PayPalService';
import RazorpayService from './RazorpayService';
import CashfreePaymentService from './CashfreeService';

/**
 * Factory function to get the appropriate payment service
 */
export function getPaymentService(gateway: string): PaymentService {
  switch (gateway.toLowerCase()) {
    case 'stripe':
      return StripeService;
    case 'paypal':
      return PayPalService;
    case 'razorpay':
      return RazorpayService;
    case 'cashfree':
      return CashfreePaymentService;
    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
}

export type { PaymentService } from './PaymentService';
export { StripeService, PayPalService, RazorpayService, CashfreePaymentService };
