import type { PaymentService, PaymentDetails, PaymentResult } from './PaymentService';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'SANDBOX';

function getCashfreeClient() {
  const env = CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
  return new Cashfree(env, CASHFREE_APP_ID, CASHFREE_SECRET_KEY);
}

const CashfreePaymentService: PaymentService = {
  async createPayment(details: PaymentDetails) {
    try {
      const cashfree = getCashfreeClient();
      const response = await cashfree.PGCreateOrder({
        order_amount: details.amount,
        order_currency: details.currency || 'INR',
        order_id: details.orderId,
        customer_details: {
          customer_id: details.orderId,
          customer_email: details.customerEmail || '',
          customer_phone: details.customerPhone || '',
          customer_name: details.customerName || '',
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/quote/${details.metadata?.quotation_id}?payment=success&order_id={order_id}`,
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/api/payments/cashfree/webhook`,
        },
        order_note: details.description,
      });

      const data = response.data;
      return {
        orderId: data?.order_id,
        paymentId: data?.cf_order_id?.toString(),
        clientSecret: data?.payment_session_id,
      };
    } catch (error: any) {
      console.error('Cashfree create order error:', error?.response?.data || error);
      return { error: error?.response?.data?.message || 'Failed to create payment order' };
    }
  },

  async verifyPayment(orderId: string) {
    try {
      const cashfree = getCashfreeClient();
      const response = await cashfree.PGOrderFetchPayments(orderId);
      const payments = response.data;

      if (!payments || !Array.isArray(payments) || payments.length === 0) {
        return { success: false, error: 'No payments found' };
      }

      const successPayment = payments.find((p: any) => p.payment_status === 'SUCCESS');

      if (successPayment) {
        return {
          success: true,
          transactionId: successPayment.cf_payment_id?.toString(),
          gatewayResponse: successPayment,
        };
      }

      return { success: false, error: 'Payment not completed' };
    } catch (error: any) {
      console.error('Cashfree verify error:', error?.response?.data || error);
      return { success: false, error: 'Verification failed' };
    }
  },

  async handleWebhook(payload: any) {
    try {
      const { data } = payload;
      const orderData = data?.order;
      const paymentData = data?.payment;

      if (!orderData) return { status: 'error' };

      const status = paymentData?.payment_status === 'SUCCESS' ? 'paid' : 'failed';
      return {
        status,
        orderId: orderData.order_id,
        paymentId: paymentData?.cf_payment_id?.toString(),
      };
    } catch (error) {
      console.error('Cashfree webhook error:', error);
      return { status: 'error' };
    }
  },
};

export default CashfreePaymentService;

// Helper: Create a payment link for a quotation
export async function createPaymentLink(params: {
  quotation_id: string;
  quotation_number: string;
  amount: number;
  client_name: string;
  client_email: string;
  client_phone: string;
}) {
  try {
    const cashfree = getCashfreeClient();
    const response = await cashfree.PGCreateLink({
      link_id: `PAY-${params.quotation_number}-${Date.now()}`,
      link_amount: params.amount,
      link_currency: 'INR',
      link_purpose: `Payment for Quotation ${params.quotation_number}`,
      customer_details: {
        customer_name: params.client_name,
        customer_email: params.client_email,
        customer_phone: params.client_phone,
      },
      link_notify: {
        send_sms: false,
        send_email: false,
      },
      link_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/quote/${params.quotation_id}?payment=success`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://formiqstudio.com'}/api/payments/cashfree/webhook`,
      },
      link_notes: {
        quotation_id: params.quotation_id,
        quotation_number: params.quotation_number,
      },
    });

    return {
      success: true,
      link_url: response.data?.link_url,
      link_id: response.data?.link_id,
    };
  } catch (error: any) {
    console.error('Cashfree payment link error:', error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.message || 'Failed to create payment link',
    };
  }
}
