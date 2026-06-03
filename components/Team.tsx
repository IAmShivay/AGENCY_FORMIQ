"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from './ui/card';
import { Linkedin, Twitter, Github } from 'lucide-react';

const team = [
  {
    name: 'Shivay Sharma',
    role: 'CEO & Founder FullStack Developer',
    image: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'Swagata mahtree',
    role: 'Lead Developer',
    image: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'Vishal Rajbhar',
    role: 'UX Designer',
    image: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'K Chakraborty',
    role: 'Project Manager',
    image: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  }
];

const Team = () => {
  // Animation variants
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
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="premium-text-gradient">Meet Our Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Talented professionals dedicated to delivering exceptional results
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <Card className="premium-card premium-card-hover overflow-hidden h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
              <div className="relative h-64 group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={member.social.linkedin} className="text-white hover:text-primary">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href={member.social.twitter} className="text-white hover:text-primary">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href={member.social.github} className="text-white hover:text-primary">
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;