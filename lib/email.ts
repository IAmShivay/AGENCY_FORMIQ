import nodemailer from 'nodemailer';
import { supabase } from './supabaseClient';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  template_type: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

// Create SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"FormiqStudio" <${process.env.SMTP_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      attachments: emailData.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.content, 'base64'),
        contentType: att.contentType
      }))
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }

    return templates || [];
  } catch (error) {
    console.error('Error in getEmailTemplates:', error);
    return [];
  }
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

export async function sendProposalEmail(
  leadData: any,
  proposalData: any,
  templateId?: string,
  pdfContent?: string
): Promise<boolean> {
  try {
    // Get email template
    let template: EmailTemplate;
    
    if (templateId) {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error || !data) {
        throw new Error('Template not found');
      }
      template = data;
    } else {
      // Use default proposal template
      const templates = await getEmailTemplates();
      const defaultTemplate = templates.find(t => t.template_type === 'proposal');
      if (!defaultTemplate) {
        throw new Error('No proposal template found');
      }
      template = defaultTemplate;
    }

    // Prepare template variables
    const variables = {
      lead_name: leadData.name,
      company_name: leadData.company || 'Your Company',
      project_type: leadData.project_type,
      project_description: leadData.description || 'Custom software development project',
      total_amount: `$${proposalData.total_amount?.toLocaleString() || 'TBD'}`,
      proposal_title: proposalData.title || 'Software Development Proposal'
    };

    // Replace variables in template
    const subject = replaceTemplateVariables(template.subject, variables);
    const htmlContent = replaceTemplateVariables(template.html_content, variables);
    const textContent = template.text_content ? 
      replaceTemplateVariables(template.text_content, variables) : undefined;

    // Prepare email data
    const emailData: EmailData = {
      to: leadData.email,
      subject,
      html: htmlContent,
      text: textContent
    };

    // Add PDF attachment if provided
    if (pdfContent) {
      emailData.attachments = [{
        filename: `${leadData.name.replace(/\s+/g, '_')}_Proposal.pdf`,
        content: Buffer.from(pdfContent).toString('base64'),
        contentType: 'application/pdf'
      }];
    }

    // Send email
    const success = await sendEmail(emailData);

    // Log email attempt
    await logEmailAttempt(
      leadData.id,
      proposalData.id,
      template.id,
      leadData.email,
      subject,
      success ? 'sent' : 'failed'
    );

    return success;
  } catch (error) {
    console.error('Error sending proposal email:', error);
    
    // Log failed attempt
    await logEmailAttempt(
      leadData.id,
      null,
      templateId || null,
      leadData.email,
      'Failed to send proposal',
      'failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
    
    return false;
  }
}

async function logEmailAttempt(
  leadId: string,
  proposalId: string | null,
  templateId: string | null,
  recipientEmail: string,
  subject: string,
  status: 'sent' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    await supabase
      .from('email_logs')
      .insert({
        lead_id: leadId,
        proposal_id: proposalId,
        template_id: templateId,
        recipient_email: recipientEmail,
        subject,
        status,
        error_message: errorMessage,
        sent_at: status === 'sent' ? new Date().toISOString() : null
      });
  } catch (error) {
    console.error('Error logging email attempt:', error);
  }
}

export async function getEmailLogs(leadId: string): Promise<any[]> {
  try {
    const { data: logs, error } = await supabase
      .from('email_logs')
      .select(`
        *,
        email_templates(name, template_type),
        proposals(title)
      `)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching email logs:', error);
      return [];
    }

    return logs || [];
  } catch (error) {
    console.error('Error in getEmailLogs:', error);
    return [];
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP configuration is valid');
    return true;
  } catch (error) {
    console.error('SMTP configuration error:', error);
    return false;
  }
}
