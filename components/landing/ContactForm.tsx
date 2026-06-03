"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  User, 
  Building, 
  MessageSquare, 
  Send,
  CheckCircle,
  Clock,
  Shield,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactForm = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const projectTypes = [
    "Web Application",
    "Mobile App",
    "E-commerce Platform",
    "CRM/ERP System",
    "API Development",
    "Database Design",
    "System Integration",
    "Other"
  ];

  const budgetRanges = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000+",
    "Let's discuss"
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get a response within 2 hours"
    },
    {
      icon: Shield,
      title: "Free Consultation",
      description: "No obligation strategy session"
    },
    {
      icon: Star,
      title: "Expert Advice",
      description: "Guidance from senior developers"
    }
  ];

  if (isSubmitted) {
    return (
      <section id="contact-form" className="py-20 bg-gradient-to-br from-green-50/50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white dark:bg-card rounded-2xl p-8 border border-green-200 dark:border-green-800 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-200">
                Thank You!
              </h2>
              <p className="text-lg text-green-700 dark:text-green-300 mb-6">
                Your message has been received. Our team will review your requirements 
                and get back to you within 2 hours with a detailed proposal.
              </p>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">
                  📧 Check your email for a confirmation message<br/>
                  📞 Expect a call from our team within 2 hours<br/>
                  💼 We'll prepare a custom proposal for your project
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" ref={sectionRef} className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Free Strategy Session
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your business? Fill out the form below and our team 
              will contact you within 2 hours with a custom proposal.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Type *
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Description *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="pl-10 min-h-[120px]"
                        placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-3"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Get Free Strategy Session
                        <Send className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    🔒 Your information is secure and will never be shared with third parties.
                  </p>
                </form>
              </div>
            </motion.div>

            {/* Benefits & Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* What Happens Next */}
              <div className="bg-card rounded-2xl p-8 border border-border/50">
                <h3 className="text-xl font-bold mb-6">What Happens Next?</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 mr-4">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-200">
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    We're so confident in our work that we offer a full refund 
                    if you're not completely satisfied.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
