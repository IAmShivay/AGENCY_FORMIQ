'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PaymentGatewaySelector from '@/components/checkout/PaymentGatewaySelector';
import { usePayment } from '@/hooks/usePayment';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string | null>('stripe');
  const [orderDetails, setOrderDetails] = useState({
    orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
    amount: 99.99,
    items: [
      { name: 'Domain Registration', price: 12.99 },
      { name: 'Web Hosting (1 Year)', price: 59.99 },
      { name: 'SSL Certificate', price: 19.99 },
      { name: 'Setup Fee', price: 7.99 }
    ]
  });

  // Use our payment hook
  const {
    isLoading: paymentLoading,
    error: paymentError,
    processStripePayment,
    processPayPalPayment,
    processRazorpayPayment,
    verifyRazorpayPayment
  } = usePayment();

  // Set error from payment hook
  useEffect(() => {
    if (paymentError) {
      setError(paymentError);
    }
  }, [paymentError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Process payment based on selected gateway
      if (selectedGateway === 'stripe') {
        const result = await processStripePayment({
          amount: orderDetails.amount,
          orderId: orderDetails.orderId,
          description: 'Payment for formiqstudio services'
        });

        if (result?.clientSecret) {
          // In a real implementation, we would use the Stripe.js SDK to confirm the payment
          // For now, we'll just simulate a successful payment
          console.log('Stripe payment initiated with client secret:', result.clientSecret);
          setIsComplete(true);
          setStep(3);
        }
      }
      else if (selectedGateway === 'paypal') {
        const result = await processPayPalPayment({
          amount: orderDetails.amount,
          orderId: orderDetails.orderId,
          description: 'Payment for formiqstudio services'
        });

        if (result?.orderId) {
          // In a real implementation, we would redirect to PayPal for payment
          // For now, we'll just simulate a successful payment
          console.log('PayPal payment initiated with order ID:', result.orderId);
          setIsComplete(true);
          setStep(3);
        }
      }
      else if (selectedGateway === 'razorpay') {
        const result = await processRazorpayPayment({
          amount: orderDetails.amount,
          orderId: orderDetails.orderId,
          description: 'Payment for formiqstudio services',
          currency: 'INR',
          customerEmail: 'customer@example.com', // In a real app, get this from form
          customerPhone: '9876543210' // In a real app, get this from form
        });

        if (result?.orderId) {
          // In a real implementation, we would open the Razorpay checkout
          // For now, we'll just simulate a successful payment
          console.log('Razorpay payment initiated with order ID:', result.orderId);
          setIsComplete(true);
          setStep(3);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/services/domains" className="inline-flex items-center text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Domain Search
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          {isComplete ? 'Order Complete' : 'Checkout'}
        </h1>
      </div>

      {/* Progress Steps */}
      {!isComplete && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>
            <div className="flex-1 mx-2">
              <div className={`h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div className={step >= 1 ? 'text-primary font-medium' : 'text-gray-500'}>Order Summary</div>
            <div className={step >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>Payment</div>
            <div className={step >= 3 ? 'text-primary font-medium' : 'text-gray-500'}>Confirmation</div>
          </div>
        </div>
      )}

      {/* Order Complete */}
      {isComplete ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">Order Successful!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          <div className="mt-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 text-left">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                <span className="text-gray-900 dark:text-white font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-white font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {selectedGateway === 'stripe' ? 'Credit Card' :
                   selectedGateway === 'paypal' ? 'PayPal' :
                   selectedGateway === 'razorpay' ? 'Razorpay' : 'Credit Card'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="text-gray-900 dark:text-white font-medium">${orderDetails.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/user/services"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View My Services
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Step 1: Order Summary */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {orderDetails.items.map((item, index) => (
                      <li key={index} className="py-6 flex">
                        <div className="flex-1 flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">1 year</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Subtotal</p>
                  <p>${orderDetails.amount.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Taxes calculated at checkout.</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setStep(2)}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h2>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
                    </div>
                  </div>
                )}

                {/* Payment Gateway Selector */}
                <PaymentGatewaySelector
                  selectedGateway={selectedGateway}
                  onSelect={setSelectedGateway}
                />

                {/* Conditional rendering based on selected payment gateway */}
                {selectedGateway === 'stripe' && (
                  <div className="space-y-4 mt-6">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Card Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="card-number"
                          id="card-number"
                          className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="4242 4242 4242 4242"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          name="expiration-date"
                          id="expiration-date"
                          className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="MM / YY"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          id="cvc"
                          className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}

                {selectedGateway === 'paypal' && (
                  <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/10 rounded-md text-center">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You'll be redirected to PayPal to complete your payment securely.
                    </p>
                    <div className="w-48 h-12 mx-auto bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <img src="/images/payment/paypal-button.png" alt="PayPal checkout" className="h-8" />
                    </div>
                  </div>
                )}

                {selectedGateway === 'razorpay' && (
                  <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/10 rounded-md text-center">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      You'll be redirected to Razorpay to complete your payment securely.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-primary dark:text-primary/70 hover:text-primary/80"
                  >
                    Back to Order Summary
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </form>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Total</p>
                  <p>${orderDetails.amount.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
