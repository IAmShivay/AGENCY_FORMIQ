'use client';

import { useState } from 'react';
import { Play, Quote, Award, Users, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from './ui/SectionHeader';

interface Founder {
  id: string;
  name: string;
  role: string;
  experience: string;
  thumbnail: string;
  videoUrl: string;
  bio: string;
  achievements: string[];
  expertise: string[];
}

const founders: Founder[] = [
  {
    id: '1',
    name: 'Shivay Kumar',
    role: 'CEO & Lead Developer',
    experience: '8+ Years',
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    bio: 'Passionate about building scalable software solutions that drive business growth. Led 200+ successful projects.',
    achievements: [
      'Built 200+ successful projects',
      'Served Fortune 500 companies',
      'Expert in full-stack development',
      'Specialized in MVP development'
    ],
    expertise: ['React', 'Node.js', 'Python', 'AWS', 'DevOps']
  },
  {
    id: '2',
    name: 'Co-Founder Name',
    role: 'CTO & Technical Architect',
    experience: '7+ Years',
    thumbnail: '/api/placeholder/400/300',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    bio: 'Technical visionary focused on creating robust, scalable architectures for modern applications.',
    achievements: [
      'Architected systems for 50M+ users',
      'Expert in cloud infrastructure',
      'Led technical teams of 20+',
      'Published tech thought leader'
    ],
    expertise: ['System Design', 'Microservices', 'Kubernetes', 'Database Design', 'Security']
  }
];

const companyStats = [
  {
    icon: Users,
    value: '200+',
    label: 'Projects Delivered',
    description: 'Successful launches'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Client Satisfaction',
    description: 'Happy customers'
  },
  {
    icon: Calendar,
    value: '15 Days',
    label: 'Average MVP Time',
    description: 'Rapid delivery'
  }
];

export default function FoundersVideo() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader
          icon={Users}
          title="Meet Our Founders"
          subtitle="Learn about the vision, expertise, and passion behind FormiqStudio from our founding team"
          iconPosition="left"
          alignment="center"
        />

        {/* Company Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {companyStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center premium-card p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-primary mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Founders Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12"
        >
          {founders.map((founder) => (
            <motion.div
              key={founder.id}
              variants={itemVariants}
              className="premium-card premium-card-hover group"
            >
              {/* Video Section */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={founder.thumbnail}
                  alt={`${founder.name} founder video`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => setActiveVideo(founder.id)}
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-300 group-hover:scale-110"
                  >
                    <Play className="w-8 h-8 text-premium-purple ml-1" fill="currentColor" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-premium-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                    {founder.experience}
                  </span>
                </div>
              </div>

              {/* Founder Info */}
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-pure-black mb-2">{founder.name}</h3>
                  <p className="text-premium-purple font-semibold mb-3">{founder.role}</p>
                  <p className="text-medium-gray leading-relaxed">{founder.bio}</p>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="font-semibold text-pure-black mb-3">Key Achievements</h4>
                  <ul className="space-y-2">
                    {founder.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <Award className="w-4 h-4 text-premium-purple mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-medium-gray">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expertise */}
                <div>
                  <h4 className="font-semibold text-pure-black mb-3">Technical Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {founder.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-premium-purple/10 text-premium-purple px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Modal */}
        {activeVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-pure-black">
                    {founders.find(f => f.id === activeVideo)?.name}
                  </h3>
                  <p className="text-medium-gray">
                    {founders.find(f => f.id === activeVideo)?.role}
                  </p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-medium-gray hover:text-pure-black transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={founders.find(f => f.id === activeVideo)?.videoUrl}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allowFullScreen
                  title="Founder Video"
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="premium-card-gradient p-8 rounded-xl max-w-3xl mx-auto">
            <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl font-light text-foreground mb-6 leading-relaxed">
              "We believe in building not just software, but lasting partnerships. Every project is a chance to create something extraordinary."
            </blockquote>
            <div className="text-muted-foreground mb-6">- Our Founders</div>
            <button className="premium-button">
              Start Your Project With Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
