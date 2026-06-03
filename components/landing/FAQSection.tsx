"use client";

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const faqs = [
    {
      question: "How long does it take to develop a custom software solution?",
      answer: "Development time varies based on project complexity. Simple applications take 15-20 days, while complex enterprise solutions may take 30-45 days. We provide detailed timelines during our initial consultation and keep you updated throughout the process."
    },
    {
      question: "What technologies do you use for development?",
      answer: "We use modern, proven technologies including React, Next.js, Node.js, Python, and cloud platforms like AWS and Azure. Our tech stack is chosen based on your specific requirements to ensure optimal performance, scalability, and maintainability."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! All our plans include support ranging from 3-12 months depending on the package. We also offer extended support contracts and maintenance services to ensure your solution continues to perform optimally as your business grows."
    },
    {
      question: "Can you integrate with our existing systems?",
      answer: "Absolutely. We specialize in system integrations and can connect your new solution with existing CRM, ERP, payment systems, databases, and third-party APIs. We ensure seamless data flow and maintain system compatibility."
    },
    {
      question: "What if I'm not satisfied with the final product?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with our work, we'll provide a full refund. However, we work closely with clients throughout development to ensure the final product exceeds expectations."
    },
    {
      question: "Do you provide training for our team?",
      answer: "Yes, we include comprehensive training as part of our Professional and Enterprise packages. This includes user manuals, video tutorials, and live training sessions to ensure your team can effectively use the new system."
    },
    {
      question: "How do you ensure the security of our data?",
      answer: "Security is our top priority. We implement industry-standard encryption, secure authentication, regular security audits, and follow best practices for data protection. All our solutions are GDPR compliant and can meet specific industry regulations."
    },
    {
      question: "Can the solution scale as our business grows?",
      answer: "Absolutely. We build all solutions with scalability in mind, using cloud-native architectures and microservices when appropriate. Your system can easily handle increased users, data, and functionality as your business expands."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers. Here are the most common questions 
              our clients ask about our development process.
            </p>
          </motion.div>

          {/* FAQ Items */}
          <motion.div variants={containerVariants} className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border border-border/50 rounded-xl overflow-hidden bg-card hover:border-primary/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-border/30 pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Still Have Questions CTA */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our team is here to help. 
                Schedule a free consultation and get all your questions answered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact-form');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  Schedule Free Consultation
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-primary text-primary hover:bg-primary/5 px-8 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  Contact Support
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
