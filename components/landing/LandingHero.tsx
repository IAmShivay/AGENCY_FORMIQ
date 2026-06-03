"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, CheckCircle, Star, Users, Award, Clock, Mail, User, Building, MessageSquare, Send, Phone, Calendar, ExternalLink } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
// BackgroundPattern removed for performance
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const LandingHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.1 });
  const controls = useAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'MVP Inquiry from Landing Page',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Prepare payload for API
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
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

      // Then, also send to the external webhook
      const response = await fetch(
        "https://breaktheice.in/api/leads?action=getLeads&sourceId=7d166d36-aa13-4c81-8272-a856f0e45bd7&workspaceId=1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'MVP Inquiry from Landing Page',
          message: ''
        });
      } else {
        // Even if the webhook fails, we've saved to our database, so show success
        console.warn('External webhook failed, but message saved to database');
        setIsSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'MVP Inquiry from Landing Page',
          message: ''
        });
      }

      // Always set isSubmitting to false after the response is processed
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in landing form submission:', error);
      setFormError("An error occurred. Please try again.");
      // Make sure to set isSubmitting to false in case of error
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };



  return (
    <div
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10"
    >
      {/* Background Pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 2}s`,
            }}
          >
            <div
              className="w-20 h-20 rounded-full bg-primary/10 blur-xl"
              style={{
                transform: `scale(${0.5 + Math.random() * 0.8})`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="container relative z-10 px-4 md:px-6 py-16 md:py-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto"
          ref={textRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-6">
          {/* Urgency Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md shadow-sm urgency-blink"
          >
            <Clock className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">🔥 Only 3 MVP Spots Left This Month</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight"
          >
            <span className="block animated-gradient-text">
              Get Your MVP in 15 Days
            </span>
            <span className="block text-foreground">
              and Launch Faster
            </span>
          </motion.h1>

          {/* Value Proposition */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            From idea to market in <strong className="text-primary">just 15 days</strong>.
            We build production-ready MVPs that <strong className="text-primary">get you funded faster</strong> and
            <strong className="text-primary"> capture market opportunities</strong> before your competition.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {[
              "🚀 15-Day Delivery",
              "💰 Get Funded Faster",
              "⚡ Launch First"
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center bg-primary/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/20 text-sm font-medium text-primary"
              >
                <span>{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-1">
                <Users className="w-4 h-4 text-primary mr-1" />
                <span className="text-lg font-bold text-primary">500+</span>
              </div>
              <p className="text-xs text-muted-foreground">MVPs Built</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-1">
                <Star className="w-4 h-4 text-primary mr-1" />
                <span className="text-lg font-bold text-primary">4.9/5</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-1">
                <Award className="w-4 h-4 text-primary mr-1" />
                <span className="text-lg font-bold text-primary">15</span>
              </div>
              <p className="text-xs text-muted-foreground">Days Avg</p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={itemVariants}
            className="space-y-3 mb-6"
          >
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium text-foreground mb-3">📞 Talk to us directly:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="tel:+918918349445"
                  className="flex items-center justify-center lg:justify-start px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <Phone className="w-4 h-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="text-xs text-muted-foreground block">India</span>
                    <span className="text-sm font-medium text-primary">+91 89183 49445</span>
                  </div>
                </Link>
                <Link
                  href="tel:+12245238210"
                  className="flex items-center justify-center lg:justify-start px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <Phone className="w-4 h-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="text-xs text-muted-foreground block">USA</span>
                    <span className="text-sm font-medium text-primary">+1 224-523-8210</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Meeting Link */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium text-foreground mb-3">📅 Or schedule a meeting:</p>
              <Link
                href="https://meet.brevo.com/mr-shivay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
              >
                <Calendar className="w-4 h-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-primary mr-2">Book Free Consultation</span>
                <ExternalLink className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          </div>

          {/* Right Side - Contact Form */}
          <motion.div variants={itemVariants}>
            {isSubmitted ? (
              <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-primary">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    We'll contact you within 2 hours with your custom MVP proposal.
                  </p>
                  <div className="bg-primary/5 rounded-lg p-3 text-sm text-primary">
                    📧 Check your email for confirmation<br/>
                    📞 Expect our call within 2 hours
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-card via-card/95 to-primary/5 backdrop-blur-lg rounded-xl p-6 border border-primary/20 shadow-xl">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <Send className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1 animated-gradient-text">
                    Start Your MVP Today
                  </h3>
                  <p className="text-sm text-muted-foreground">Get a custom proposal in 2 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 h-10 focus:border-primary focus:ring-primary"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-10 focus:border-primary focus:ring-primary"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 h-10 focus:border-primary focus:ring-primary"
                      placeholder="Your Phone"
                    />
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="pl-10 min-h-[80px] focus:border-primary focus:ring-primary"
                      placeholder="Tell us about your MVP idea..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-2.5 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Get My MVP Proposal
                        <Send className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  {formError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-2 text-sm">
                      {formError}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    🔒 Secure & confidential. No spam, ever.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingHero;
