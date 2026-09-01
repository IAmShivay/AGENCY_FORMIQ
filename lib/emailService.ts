import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendQuotationEmail(
    recipientEmail: string,
    recipientName: string,
    quotationNumber: string,
    customMessage: string,
    pdfBuffer?: Buffer
  ): Promise<boolean> {
    const subject = `Quotation ${quotationNumber} - FormiqStudio`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quotation from FormiqStudio</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .email-container {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 5px;
          }
          .tagline {
            color: #666;
            font-size: 14px;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .message {
            background-color: #f8f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #6366f1;
            margin: 20px 0;
          }
          .quotation-info {
            background-color: #f0f9ff;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 12px;
          }
          .contact-info {
            margin-top: 15px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #6366f1;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">FormiqStudio</div>
            <div class="tagline">Digital Solutions & Marketing Agency</div>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${recipientName},</div>
            
            <p>Thank you for your interest in our services. Please find attached your quotation.</p>
            
            <div class="quotation-info">
              <strong>Quotation Number:</strong> ${quotationNumber}<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString()}
            </div>
            
            ${customMessage ? `
              <div class="message">
                <strong>Additional Message:</strong><br>
                ${customMessage.replace(/\n/g, '<br>')}
              </div>
            ` : ''}
            
            <p>We have attached the detailed quotation as a PDF file. Please review it and let us know if you have any questions or need any modifications.</p>
            
            <p>We look forward to working with you on this project!</p>
            
            <p>Best regards,<br>
            <strong>FormiqStudio Team</strong></p>
          </div>
          
          <div class="footer">
            <div class="contact-info">
              <strong>FormiqStudio</strong><br>
              Digital Solutions & Marketing Agency<br>
              Email: hello@formiqstudio.in<br>
              Phone: +91 8918349445 | +1 555-341-9743
            </div>
            <p style="margin-top: 20px; font-size: 11px; color: #999;">
              This email was sent from FormiqStudio. If you have any questions, please contact us at the above email address.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const attachments = pdfBuffer ? [{
      filename: `${quotationNumber}_Quotation.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    }] : undefined;

    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
      attachments
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
