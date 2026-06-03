"use client";

import { useState } from "react";
// import { motion } from "framer-motion"; // Commented for performance
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Contact = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Animation variants - commented for performance
  /*
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      // First, save to our database
      const { error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([payload]);

      if (supabaseError) {
        console.error('Error saving to database:', supabaseError);
        setFormError('Failed to save your message. Please try again.');
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in contact form submission:', error);
      setFormError("An error occurred. Please try again.");
      // Make sure to set isSubmitting to false in case of error
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-28 md:pt-36 lg:pt-44 pb-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="premium-text-gradient">Get in Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s discuss how we can help bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="contact-content p-8 bg-card/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input name="name" placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input name="email" type="email" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input name="subject" placeholder="Project inquiry" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  name="message"
                  placeholder="Tell us about your project..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 text-sm">
                  {formError}
                </div>
              )}
              <Button className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </Card>

          <div className="contact-content space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@formiqstudio.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 8918349445</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">West Bengal,City Center,713212</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-primary text-primary-foreground">
              <h4 className="text-lg font-semibold mb-2">Ready to Get Started?</h4>
              <p className="mb-4">
                Our team is ready to help you transform your business with cutting-edge software solutions.
              </p>
              <Button
                variant="secondary"
                onClick={() => window.open('https://meet.brevo.com/mr-shivay', '_blank')}
              >
                Schedule a Call
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 flex items-start gap-4 max-w-md z-50 border border-green-100 dark:border-green-900">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Message Sent!</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{popupMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPopupMessage(null)}
              className="mt-3"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
