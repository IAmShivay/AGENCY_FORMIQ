'use client';

import React from 'react';

export default function SidebarNewsletterForm() {
  return (
    <form className="flex flex-col gap-3">
      <input 
        type="email" 
        placeholder="Your email address" 
        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
        required
      />
      <button 
        type="submit" 
        className="bg-primary hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
