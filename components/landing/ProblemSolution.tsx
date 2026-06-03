"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

const ProblemSolution = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

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
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  const problems = [
    {
      icon: Clock,
      title: "Wasting Time on Manual Processes",
      description: "Your team spends hours on repetitive tasks that could be automated"
    },
    {
      icon: DollarSign,
      title: "High Operational Costs",
      description: "Inefficient systems are draining your budget and reducing profitability"
    },
    {
      icon: Users,
      title: "Poor Customer Experience",
      description: "Outdated systems are frustrating your customers and losing you business"
    }
  ];

  const solutions = [
    {
      icon: TrendingUp,
      title: "40% Efficiency Increase",
      description: "Custom automation solutions that streamline your workflows",
      metric: "40%"
    },
    {
      icon: DollarSign,
      title: "25% Cost Reduction",
      description: "Optimized systems that reduce operational expenses",
      metric: "25%"
    },
    {
      icon: Users,
      title: "95% Customer Satisfaction",
      description: "Modern interfaces that delight your customers",
      metric: "95%"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-muted/20 to-muted/40">
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
              Are These Problems Holding Your Business Back?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most businesses struggle with outdated systems and manual processes. 
              Here's how we solve these challenges.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problems Side */}
            <motion.div variants={itemVariants}>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                  <h3 className="text-2xl font-bold text-red-600">The Problems</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  These common business challenges are costing you time, money, and customers:
                </p>
              </div>

              <div className="space-y-6">
                {problems.map((problem, index) => {
                  const Icon = problem.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-red-100 dark:bg-red-900/30 mr-4">
                        <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                          {problem.title}
                        </h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          {problem.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Solutions Side */}
            <motion.div variants={itemVariants}>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-green-600">Our Solutions</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  We transform these challenges into competitive advantages:
                </p>
              </div>

              <div className="space-y-6">
                {solutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start p-4 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                        <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800 dark:text-green-200">
                            {solution.title}
                          </h4>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {solution.metric}
                          </span>
                        </div>
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          {solution.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join 500+ businesses that have already transformed their operations with our solutions.
                Get your free strategy session today.
              </p>
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
                Get Your Free Strategy Session
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;
