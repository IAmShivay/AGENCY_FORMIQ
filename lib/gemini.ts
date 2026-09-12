import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ProposalData {
  leadName: string;
  companyName: string;
  projectType: string;
  budget: string;
  description: string;
  requirements?: string[];
  timeline?: string;
}

export interface PricingBreakdown {
  phase: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface GeneratedProposal {
  title: string;
  executiveSummary: string;
  projectOverview: string;
  scope: string[];
  methodology: string;
  timeline: string;
  pricingBreakdown: PricingBreakdown[];
  totalAmount: number;
  terms: string[];
  nextSteps: string[];
}

export async function generateProposal(data: ProposalData): Promise<GeneratedProposal> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
You are a professional proposal writer for FormiqStudio, a leading digital marketing and software development agency. Generate a comprehensive, professional proposal based on the following client information:

Client Name: ${data.leadName}
Company: ${data.companyName}
Project Type: ${data.projectType}
Budget Range: ${data.budget}
Project Description: ${data.description}
Requirements: ${data.requirements?.join(', ') || 'Not specified'}
Timeline: ${data.timeline || 'To be discussed'}

Please generate a detailed proposal with the following structure in JSON format:

{
  "title": "Professional project title",
  "executiveSummary": "Brief 2-3 sentence summary of the project and value proposition",
  "projectOverview": "Detailed description of what we understand about their needs and how we'll address them",
  "scope": ["List of specific deliverables and features", "Each item should be clear and measurable"],
  "methodology": "Our development/implementation approach and process",
  "timeline": "Realistic project timeline with key milestones",
  "pricingBreakdown": [
    {
      "phase": "Phase name",
      "description": "What's included in this phase",
      "hours": estimated_hours_number,
      "rate": 75,
      "amount": calculated_amount
    }
  ],
  "totalAmount": total_project_cost,
  "terms": ["Payment terms", "Revision policy", "Support terms", "Other important terms"],
  "nextSteps": ["What happens after proposal acceptance", "Timeline for project kickoff", "Required information from client"]
}

Guidelines:
- Use professional, confident language
- Be specific about deliverables
- Price competitively but fairly (rate: $75/hour)
- Include 3-5 project phases
- Total should match budget range when possible
- Include modern technologies and best practices
- Emphasize our expertise and value
- Make it compelling and professional

Return only the JSON object, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const proposal = JSON.parse(cleanedText);
      return proposal;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      
      // Fallback proposal if parsing fails
      return generateFallbackProposal(data);
    }
  } catch (error) {
    console.error('Error generating proposal with Gemini:', error);
    return generateFallbackProposal(data);
  }
}

function generateFallbackProposal(data: ProposalData): GeneratedProposal {
  const baseRate = 75;
  const estimatedHours = getBudgetHours(data.budget);
  
  return {
    title: `${data.projectType} Development Proposal for ${data.companyName}`,
    executiveSummary: `FormiqStudio is excited to partner with ${data.companyName} to deliver a comprehensive ${data.projectType.toLowerCase()} solution that meets your business objectives and drives growth.`,
    projectOverview: `Based on our discussion, we understand that ${data.companyName} requires a ${data.projectType.toLowerCase()} solution. ${data.description}`,
    scope: [
      'Requirements analysis and project planning',
      'UI/UX design and prototyping',
      'Development and implementation',
      'Testing and quality assurance',
      'Deployment and launch support',
      'Documentation and training',
      'Post-launch support and maintenance'
    ],
    methodology: 'We follow an agile development methodology with regular client communication, iterative development cycles, and continuous feedback integration to ensure the final product exceeds expectations.',
    timeline: 'The project is estimated to take 8-12 weeks from kickoff to launch, with regular milestone reviews and client feedback sessions.',
    pricingBreakdown: [
      {
        phase: 'Discovery & Planning',
        description: 'Requirements gathering, technical analysis, and project planning',
        hours: Math.round(estimatedHours * 0.15),
        rate: baseRate,
        amount: Math.round(estimatedHours * 0.15 * baseRate)
      },
      {
        phase: 'Design & Prototyping',
        description: 'UI/UX design, wireframes, and interactive prototypes',
        hours: Math.round(estimatedHours * 0.25),
        rate: baseRate,
        amount: Math.round(estimatedHours * 0.25 * baseRate)
      },
      {
        phase: 'Development',
        description: 'Core development, feature implementation, and integration',
        hours: Math.round(estimatedHours * 0.45),
        rate: baseRate,
        amount: Math.round(estimatedHours * 0.45 * baseRate)
      },
      {
        phase: 'Testing & Launch',
        description: 'Quality assurance, testing, deployment, and launch support',
        hours: Math.round(estimatedHours * 0.15),
        rate: baseRate,
        amount: Math.round(estimatedHours * 0.15 * baseRate)
      }
    ],
    totalAmount: estimatedHours * baseRate,
    terms: [
      '50% payment upon project commencement, 50% upon completion',
      'Up to 3 rounds of revisions included per phase',
      '30 days of post-launch support included',
      'Source code and documentation provided upon final payment',
      'Additional features or changes will be quoted separately'
    ],
    nextSteps: [
      'Review and approve this proposal',
      'Sign the project agreement and process initial payment',
      'Schedule project kickoff meeting',
      'Begin discovery and planning phase',
      'Regular progress updates and milestone reviews'
    ]
  };
}

function getBudgetHours(budget: string): number {
  const budgetLower = budget.toLowerCase();
  
  if (budgetLower.includes('5000') || budgetLower.includes('5k')) return 67;
  if (budgetLower.includes('10000') || budgetLower.includes('10k')) return 133;
  if (budgetLower.includes('15000') || budgetLower.includes('15k')) return 200;
  if (budgetLower.includes('20000') || budgetLower.includes('20k')) return 267;
  if (budgetLower.includes('25000') || budgetLower.includes('25k')) return 333;
  if (budgetLower.includes('50000') || budgetLower.includes('50k')) return 667;
  
  // Default estimation
  return 133;
}

export async function generateProposalPDF(proposal: GeneratedProposal, leadData: ProposalData): Promise<string> {
  // This would integrate with a PDF generation library
  // For now, return HTML content that can be converted to PDF
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${proposal.title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #F97316 100%); color: white; padding: 40px; text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 36px; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #8B5CF6; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px; }
        .pricing-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .pricing-table th, .pricing-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .pricing-table th { background: #f8fafc; font-weight: bold; }
        .total-row { background: #8B5CF6; color: white; font-weight: bold; }
        .scope-list, .terms-list { list-style-type: none; padding: 0; }
        .scope-list li, .terms-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
        .scope-list li:before { content: "✓ "; color: #10B981; font-weight: bold; }
        .contact-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FormiqStudio</h1>
        <p>Digital Marketing & Development Agency</p>
    </div>
    
    <div class="section">
        <h1>${proposal.title}</h1>
        <p><strong>Prepared for:</strong> ${leadData.leadName}, ${leadData.companyName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>${proposal.executiveSummary}</p>
    </div>
    
    <div class="section">
        <h2>Project Overview</h2>
        <p>${proposal.projectOverview}</p>
    </div>
    
    <div class="section">
        <h2>Project Scope</h2>
        <ul class="scope-list">
            ${proposal.scope.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>Methodology</h2>
        <p>${proposal.methodology}</p>
    </div>
    
    <div class="section">
        <h2>Timeline</h2>
        <p>${proposal.timeline}</p>
    </div>
    
    <div class="section">
        <h2>Investment Breakdown</h2>
        <table class="pricing-table">
            <thead>
                <tr>
                    <th>Phase</th>
                    <th>Description</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${proposal.pricingBreakdown.map(item => `
                    <tr>
                        <td>${item.phase}</td>
                        <td>${item.description}</td>
                        <td>${item.hours}</td>
                        <td>$${item.rate}/hr</td>
                        <td>$${item.amount.toLocaleString()}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="4"><strong>Total Investment</strong></td>
                    <td><strong>$${proposal.totalAmount.toLocaleString()}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h2>Terms & Conditions</h2>
        <ul class="terms-list">
            ${proposal.terms.map(term => `<li>${term}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>Next Steps</h2>
        <ol>
            ${proposal.nextSteps.map(step => `<li>${step}</li>`).join('')}
        </ol>
    </div>
    
    <div class="contact-info">
        <h3>Contact Information</h3>
        <p><strong>FormiqStudio</strong><br>
        Email: hello@formiqstudio.in<br>
        India: +91 8918349445<br>
        WhatsApp: +91 9832078313<br>
        Website: www.formiqstudio.com</p>
    </div>
</body>
</html>
  `;
  
  return htmlContent;
}
