import React, { useState } from 'react';
import Image from 'next/image';

interface PaymentGatewaySelectorProps {
  onSelect: (gateway: string) => void;
  selectedGateway: string | null;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({ 
  onSelect, 
  selectedGateway 
}) => {
  const paymentOptions = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: '/images/payment/stripe.svg',
      logoAlt: 'Stripe logo'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '/images/payment/paypal.svg',
      logoAlt: 'PayPal logo'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'UPI, Netbanking, and more payment options',
      icon: '/images/payment/razorpay.svg',
      logoAlt: 'Razorpay logo'
    }
  ];

  return (
    <div className="mt-6">
      <div className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Select Payment Method
      </div>
      <div className="space-y-4">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`relative rounded-lg border p-4 flex items-center cursor-pointer transition-all ${
              selectedGateway === option.id
                ? 'border-primary bg-primary/10 dark:bg-primary/10 dark:border-primary/70'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md overflow-hidden">
              <div className="relative h-8 w-8">
                <Image
                  src={option.icon}
                  alt={option.logoAlt}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {option.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {option.description}
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  selectedGateway === option.id
                    ? 'border-primary bg-primary dark:border-primary/70 dark:bg-primary/70'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {selectedGateway === option.id && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentGatewaySelector;
