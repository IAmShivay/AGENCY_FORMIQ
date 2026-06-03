'use client';

import React from 'react';

export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3">
      <input 
        type="email" 
        placeholder="Your email address" 
        className="flex-grow px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        required
      />
      <button 
        type="submit" 
        className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
