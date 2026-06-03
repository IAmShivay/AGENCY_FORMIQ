import nodemailer from 'nodemailer';
import logger from '../logger';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Create a reusable transporter object
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize the email transporter with SMTP settings
 */
export function initEmailTransporter() {
  // Only initialize if not already initialized
  if (transporter) return;

  try {
    // Get SMTP settings from environment variables
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true';

    // Validate required settings
    if (!host || !user || !pass) {
      logger.warn('SMTP settings not configured. Email functionality will be simulated.');
      return;
    }

    // Create the transporter
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    logger.info('Email transporter initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize email transporter:', { error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    // Initialize transporter if not already initialized
    if (!transporter) {
      initEmailTransporter();
    }

    // If transporter is still null, simulate sending
    if (!transporter) {
      logger.info('Simulating email send:', {
        to: options.to,
        subject: options.subject,
      });

      // Simulate a successful send
      return {
        success: true,
        messageId: `simulated-${Date.now()}`,
      };
    }

    // Set default from address if not provided
    const from = options.from || process.env.SMTP_FROM || 'contact@formiqstudio.com';

    // Send the email
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    logger.info('Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    logger.error('Failed to send email:', error);

    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
}

// Initialize the email transporter on module load
initEmailTransporter();
