'use client';

import { Building2, Users, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

interface Brand {
  name: string;
  logo: string;
  industry: string;
  description: string;
  testimonial: string;
  clientName: string;
  clientRole: string;
  rating: number;
}

const trustedBrands: Brand[] = [
  {
    name: 'SCRAFT STUDIOS',
    logo: 'https://res.cloudinary.com/dzwekdoeo/image/upload/c_thumb,w_200,g_face/v1743188631/WhatsApp_Image_2025-03-29_at_00.33.15_efa2e713_nk06px.jpg',
    industry: 'Creative Studio',
    description: 'Professional creative studio specializing in digital content creation and brand development',
    testimonial: 'FormiqStudio delivered exceptional creative solutions that perfectly captured our brand vision.',
    clientName: 'Creative Director',
    clientRole: 'SCRAFT STUDIOS',
    rating: 5
  },
  {
    name: 'NEWBY',
    logo: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    industry: 'Technology',
    description: 'Innovative technology company focused on cutting-edge digital solutions and user experience',
    testimonial: 'Professional team with excellent technical expertise. Delivered exactly what we needed on time.',
    clientName: 'Project Manager',
    clientRole: 'NEWBY',
    rating: 5
  },
  {
    name: 'DEF',
    logo: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743188683/WhatsApp_Image_2025-03-29_at_00.34.15_ec7d3f75_auxnu9.jpg',
    industry: 'Business Solutions',
    description: 'Strategic business solutions provider helping companies optimize their digital presence',
    testimonial: 'FormiqStudio transformed our digital strategy with innovative solutions and seamless execution.',
    clientName: 'Business Development Lead',
    clientRole: 'DEF',
    rating: 5
  },
  {
    name: 'SUPREME CONSULTANCY',
    logo: 'https://res.cloudinary.com/dyiso4ohk/image/upload/v1755940244/ChatGPT_Image_Aug_23_2025_02_37_19_PM_fl2vpb.png',
    industry: 'Consulting',
    description: 'Premier consulting firm providing strategic guidance and digital transformation services',
    testimonial: 'Outstanding technical expertise and project management. They exceeded all our expectations.',
    clientName: 'Senior Consultant',
    clientRole: 'SUPREME CONSULTANCY',
    rating: 5
  },
  {
    name: 'SHIVAN INTERNATIONAL',
    logo: 'https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1737741987~exp=1737745587~hmac=ffe9d688d1f315d3f023b5445657f88627f6b86bf1817496fbee11436b777271&w=740',
    industry: 'International Trade',
    description: 'Global trading company specializing in international business development and market expansion',
    testimonial: 'FormiqStudio helped us establish a strong digital presence in international markets.',
    clientName: 'International Operations Manager',
    clientRole: 'SHIVAN INTERNATIONAL',
    rating: 5
  },
  {
    name: 'TURINOS.AI',
    logo: 'https://turinos.ai/images/logos/main-logo.svg',
    industry: 'Artificial Intelligence',
    description: 'AI-powered platform providing intelligent automation solutions for modern businesses',
    testimonial: 'The best development agency we have worked with. Exceptional AI integration and support.',
    clientName: 'AI Solutions Architect',
    clientRole: 'TURINOS.AI',
    rating: 5
  }
];

const stats = [
  {
    icon: Building2,
    value: '25+',
    label: 'Companies Served',
    description: 'From startups to Fortune 500'
  },
  {
    icon: Users,
    value: '10000+',
    label: 'End Users Reached',
    description: 'Through our client platforms'
  },
  {
    icon: Award,
    value: '98%',
    label: 'Client Satisfaction',
    description: 'Based on project reviews'
  },
  {
    icon: TrendingUp,
    value: '15 Days',
    label: 'Average MVP Time',
    description: 'From concept to launch'
  }
];

export default function TrustedBrands() {
  return (
    <section className="py-20 md:py-24 lg:py-28 bg-muted/30">
      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 max-w-[1600px] mx-auto">
        <div className="mb-16 lg:mb-20 xl:mb-24">
          <SectionHeader
            icon={Building2}
            title="Trusted by Industry Leaders"
            subtitle="We've helped companies across industries build, scale, and succeed with cutting-edge software solutions"
            iconPosition="right"
            alignment="center"
          />
        </div>

        {/* Stats Grid - motion commented for performance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-20 lg:mb-24 xl:mb-28">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-card border border-border rounded-2xl p-6 md:p-8 lg:p-10 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">{stat.value}</div>
              <div className="text-base md:text-lg lg:text-xl font-semibold text-primary mb-1 md:mb-2">{stat.label}</div>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Brands Auto-Scrolling Carousel - motion commented for performance */}
        <div className="relative overflow-hidden">
          {/* Custom CSS Auto-Scrolling Container */}
          <div className="brands-carousel-container">
            <div className="brands-carousel-track">
              {/* Show only original brands for better performance */}
              {trustedBrands.map((brand, index) => (
                <div key={index} className="brands-carousel-slide">
                <div className="premium-card premium-card-hover group overflow-hidden h-full rounded-2xl">
                  {/* Header with Logo */}
                  <div className="p-6 md:p-8 lg:p-10 border-b border-border">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="h-10 md:h-12 lg:h-14 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(brand.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-warning-amber fill-current" />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">{brand.name}</h3>
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 md:px-5 md:py-3 rounded-full text-sm md:text-base font-medium">
                      {brand.industry}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 lg:p-10">
                    <p className="text-medium-gray text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed">{brand.description}</p>
                    
                    {/* Testimonial */}
                    <div className="bg-clean-gray rounded-xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
                      <p className="text-pure-black italic text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed">"{brand.testimonial}"</p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-premium-purple/10 rounded-full flex items-center justify-center mr-3 md:mr-4 lg:mr-5">
                          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-premium-purple" />
                        </div>
                        <div>
                          <div className="font-semibold text-pure-black text-sm md:text-base lg:text-lg">{brand.clientName}</div>
                          <div className="text-medium-gray text-xs md:text-sm lg:text-base">{brand.clientRole}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA - motion commented for performance */}
        <div className="text-center mt-16 lg:mt-20 xl:mt-24">
          <p className="text-lg md:text-xl lg:text-2xl text-medium-gray mb-6 md:mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto">
            Join the companies that trust FormiqStudio with their most important projects
          </p>
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center">
            <button className="premium-button px-8 md:px-10 lg:px-12 xl:px-14 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl font-semibold rounded-2xl">
              Start Your Project
            </button>
            <button className="premium-button-outline px-8 md:px-10 lg:px-12 xl:px-14 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl font-semibold rounded-2xl">
              View Case Studies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}