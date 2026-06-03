import React from 'react';
import Image from 'next/image';

interface Testimonial {
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    image: string;
  };
}

interface ServiceTestimonialsProps {
  testimonials: Testimonial[];
}

const ServiceTestimonials: React.FC<ServiceTestimonialsProps> = ({ testimonials }) => {
  return (
    <div className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="premium-card premium-card-hover rounded-xl p-8"
            >
              <div className="relative">
                <svg 
                  className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-primary/20 dark:text-primary/10" 
                  fill="currentColor" 
                  viewBox="0 0 32 32" 
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="relative text-lg text-gray-600 dark:text-gray-300">
                  {testimonial.content}
                </p>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <Image 
                    className="h-10 w-10 rounded-full" 
                    src={testimonial.author.image} 
                    alt={testimonial.author.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {testimonial.author.name}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.author.role}, {testimonial.author.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTestimonials;
