// Add sample data to the portfolio tables
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ksodprlwmxmitufelmto.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzb2Rwcmx3bXhtaXR1ZmVsbXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjQwMzMsImV4cCI6MjA1ODY0MDAzM30.H8Oytj8i1kSsqoG8sVc8VDTxB1rrHOskUL9wn1JDxOs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addSampleData() {
  console.log('Adding sample data to portfolio tables...');

  // Add sample website project
  const { data: websiteData, error: websiteError } = await supabase
    .from('portfolio_websites')
    .insert([
      {
        title: 'Real-Time E-Commerce Platform',
        description: 'A modern e-commerce solution with real-time inventory tracking and payment integration.',
        category: 'E-Commerce',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189525/Screenshot_7_ayiazz.png',
        tags: ['Next.js', 'Supabase', 'Stripe'],
        features: ['Real-time Inventory', 'User Accounts', 'Secure Payments', 'Order Tracking'],
        completion_date: 'April 2024',
        live_link: 'https://example.com',
        repo_link: 'https://github.com/example/ecommerce',
        case_study_challenge: 'The client needed a modern e-commerce platform with real-time inventory tracking.',
        case_study_solution: 'We developed a custom e-commerce solution using Next.js and Supabase for real-time updates.',
        case_study_results: 'The new platform increased conversion rates by 40% and reduced cart abandonment by 30%.',
        case_study_testimonial: 'The team delivered an exceptional e-commerce platform that exceeded our expectations!',
        case_study_screens: [
          'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189525/Screenshot_7_ayiazz.png',
          'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189667/Screenshot_2_bftgrp.png'
        ]
      },
      {
        title: 'Corporate Website Redesign',
        description: 'A complete redesign of a corporate website with modern UI and improved user experience.',
        category: 'Corporate',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189667/Screenshot_2_bftgrp.png',
        tags: ['React', 'Tailwind CSS', 'Framer Motion'],
        features: ['Responsive Design', 'Blog System', 'Contact Forms', 'Team Profiles'],
        completion_date: 'March 2024',
        live_link: 'https://example.com',
        repo_link: 'https://github.com/example/corporate',
        case_study_challenge: 'The client needed a modern website that would better represent their brand.',
        case_study_solution: 'We redesigned their website with a focus on user experience and modern aesthetics.',
        case_study_results: 'The new website led to a 65% increase in lead generation.',
        case_study_testimonial: 'The redesign perfectly captures our brand identity and has significantly improved our online presence.',
        case_study_screens: [
          'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189667/Screenshot_2_bftgrp.png',
          'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189525/Screenshot_7_ayiazz.png'
        ]
      }
    ])
    .select();

  if (websiteError) {
    console.error('Error adding website data:', websiteError);
  } else {
    console.log('Website data added successfully:', websiteData);
  }

  // Add sample app project
  const { data: appData, error: appError } = await supabase
    .from('portfolio_apps')
    .insert([
      {
        title: 'Health & Fitness Tracker',
        description: 'A comprehensive fitness tracking application with personalized workout plans and nutrition guidance.',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189525/Screenshot_7_ayiazz.png',
        tags: ['React Native', 'Firebase', 'Redux'],
        platforms: ['iOS', 'Android'],
        link: 'https://example.com',
        features: ['Activity Tracking', 'Meal Planning', 'Progress Analytics', 'Community Forums'],
        year: '2024'
      },
      {
        title: 'Task Management App',
        description: 'A productivity app for managing tasks, projects, and team collaboration.',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189667/Screenshot_2_bftgrp.png',
        tags: ['Flutter', 'Firebase', 'BLoC'],
        platforms: ['iOS', 'Android', 'Web'],
        link: 'https://example.com',
        features: ['Task Management', 'Team Collaboration', 'Calendar Integration', 'File Sharing'],
        year: '2023'
      }
    ])
    .select();

  if (appError) {
    console.error('Error adding app data:', appError);
  } else {
    console.log('App data added successfully:', appData);
  }

  // Add sample design project
  const { data: designData, error: designError } = await supabase
    .from('portfolio_designs')
    .insert([
      {
        title: 'Brand Identity System',
        description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189525/Screenshot_7_ayiazz.png',
        category: 'Branding',
        client: 'TechStart Solutions',
        link: 'https://example.com',
        year: '2024',
        services: ['Logo Design', 'Brand Guidelines', 'Marketing Materials']
      },
      {
        title: 'E-Commerce UI Design',
        description: 'Modern and intuitive user interface design for an e-commerce platform.',
        image: 'https://res.cloudinary.com/dzwekdoeo/image/upload/v1743189667/Screenshot_2_bftgrp.png',
        category: 'UI/UX',
        client: 'Fashion Forward',
        link: 'https://example.com',
        year: '2023',
        services: ['UI Design', 'Wireframing', 'Prototyping']
      }
    ])
    .select();

  if (designError) {
    console.error('Error adding design data:', designError);
  } else {
    console.log('Design data added successfully:', designData);
  }

  console.log('Sample data addition complete!');
}

// Run the function
addSampleData()
  .catch(error => {
    console.error('Error:', error);
  });
