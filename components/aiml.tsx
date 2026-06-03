'use client';

import {
  Brain, Bot, Cpu, BarChart3,
  Microscope, Workflow, Code, Rocket,
} from 'lucide-react';
import ServicePageLayout from './ServicePageLayout';

const data = {
  badge: 'AI & Machine Learning',
  badgeIcon: Brain,
  title: 'For Business Growth',
  titleAccent: 'AI & Machine Learning',
  subtitle:
    'We build intelligent AI agents, custom ML models, and workflow automation solutions that streamline operations and unlock new capabilities for your business.',
  services: [
    {
      title: 'AI Agents',
      description: 'Custom AI agents powered by leading LLMs that automate tasks, answer questions, and make decisions.',
      icon: Bot,
      features: ['GPT-4 & Claude integration', 'RAG knowledge bases', 'Conversational interfaces', 'Multi-agent systems'],
    },
    {
      title: 'ML Model Development',
      description: 'Purpose-built machine learning models trained on your data for prediction, classification, and more.',
      icon: Cpu,
      features: ['Custom model training', 'Data preprocessing', 'Model fine-tuning', 'Production deployment'],
    },
    {
      title: 'Workflow Automation',
      description: 'End-to-end process automation that connects AI capabilities with your existing tools and workflows.',
      icon: Workflow,
      features: ['N8n & Zapier flows', 'API orchestration', 'Document processing', 'Approval automation'],
    },
    {
      title: 'Analytics & Insights',
      description: 'AI-powered analytics dashboards that surface actionable insights from your business data.',
      icon: BarChart3,
      features: ['Predictive analytics', 'Natural language queries', 'Custom dashboards', 'Anomaly detection'],
    },
  ],
  servicesTitle: 'Our AI & ML Services',
  servicesSubtitle:
    'From intelligent agents to predictive models, we deliver AI solutions that create measurable business value.',
  process: [
    {
      title: 'Needs Analysis',
      description: 'We map your business processes to identify the highest-impact opportunities for AI automation.',
      icon: Microscope,
      tools: ['Process mapping', 'ROI modeling', 'Data assessment', 'Feasibility analysis'],
      benefits: 'Ensures AI investments target the areas with the greatest return on investment.',
    },
    {
      title: 'Solution Design',
      description: 'Our architects design the AI system architecture, data pipelines, and integration strategy.',
      icon: Code,
      tools: ['Architecture planning', 'Data pipeline design', 'LLM selection', 'Integration mapping'],
      benefits: 'Creates a clear technical blueprint that aligns AI capabilities with business goals.',
    },
    {
      title: 'Training & Development',
      description: 'We build, train, and validate your AI models using your proprietary data and domain knowledge.',
      icon: Brain,
      tools: ['LangChain & LlamaIndex', 'Vector databases', 'Prompt engineering', 'Model evaluation'],
      benefits: 'Delivers AI that truly understands your business context and produces accurate results.',
    },
    {
      title: 'Deploy & Monitor',
      description: 'We deploy to production with monitoring, feedback loops, and continuous improvement systems.',
      icon: Rocket,
      tools: ['Docker deployment', 'Performance dashboards', 'A/B testing', 'Feedback collection'],
      benefits: 'Ensures your AI solution delivers increasing value over time through data-driven refinement.',
    },
  ],
  processTitle: 'Our AI Development Process',
  processSubtitle:
    'A rigorous methodology that takes your AI project from opportunity identification to production deployment.',
  ctaTitle: 'Ready to Automate Your Business?',
  ctaSubtitle:
    'Let us help you harness the power of AI and machine learning to streamline operations and accelerate growth.',
  ctaIcon: Brain,
};

export default function AIMLPage() {
  return <ServicePageLayout {...data} />;
}
