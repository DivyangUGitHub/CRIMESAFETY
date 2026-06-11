import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const templates = {
  verificationEmail: (name: string, code: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #ec4899); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>CrimeSafety</h1>
          <p>Verify Your Email Address</p>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for signing up for CrimeSafety! Please verify your email address to start reporting and tracking crimes in your area.</p>
          <div class="code">
            ${code}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't create an account with CrimeSafety, you can safely ignore this email.</p>
          <div style="text-align: center;">
            <a href="#" class="button">Verify Email</a>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 CrimeSafety. All rights reserved.</p>
          <p>Making communities safer together.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  reportAlert: (report: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #ec4899); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        .severity { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .severity-high { background: #ef4444; color: white; }
        .severity-medium { background: #f59e0b; color: white; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Crime Report</h1>
          <p>Urgent Action Required</p>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ High Severity Alert</strong><br>
            A new crime report requires immediate attention.
          </div>
          
          <h2>Report Details:</h2>
          <p><strong>Title:</strong> ${report.title}</p>
          <p><strong>Category:</strong> ${report.category}</p>
          <p><strong>Location:</strong> ${report.address}</p>
          <p><strong>Time:</strong> ${new Date(report.date).toLocaleString()}</p>
          <p><strong>AI Confidence:</strong> ${Math.round(report.aiConfidence * 100)}%</p>
          
          <h3>Description:</h3>
          <p>${report.description}</p>
          
          <h3>AI Analysis:</h3>
          <p>${report.aiAnalysis}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/reports/${report.id}" class="button" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Full Report
            </a>
          </div>
        </div>
        <div class="footer">
          <p>CrimeSafety - Real-time Crime Reporting Platform</p>
          <p>This is an automated alert from the CrimeSafety system.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  reportUpdate: (report: any, update: any) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Report Update</h1>
          <p>Your report has been updated</p>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>There's been an update to your crime report:</p>
          
          <div class="update">
            <p><strong>Report ID:</strong> #${report.id}</p>
            <p><strong>Title:</strong> ${report.title}</p>
            <p><strong>Update:</strong> ${update.message}</p>
            <p><strong>Status:</strong> ${report.status}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/reports/${report.id}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Update
            </a>
          </div>
        </div>
        <div class="footer">
          <p>CrimeSafety - Keeping you informed</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export class EmailService {
  
  /**
   * Send email using Resend (preferred for production)
   */
  static async sendEmailResend({
    to,
    subject,
    html,
    from = process.env.EMAIL_FROM || 'noreply@crimesafety.com',
  }: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        console.error('Resend email error:', error);
        // Fallback to nodemailer
        return await this.sendEmailNodemailer({ to, subject, html, from });
      }

      return { success: true, data };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Fallback email sending using Nodemailer (SMTP)
   */
  static async sendEmailNodemailer({
    to,
    subject,
    html,
    from = process.env.EMAIL_FROM,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: from || process.env.SMTP_USER,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      html,
    });

    return { success: true, info };
  }

  /**
   * Send email verification code
   */
  static async sendVerificationEmail(email: string, name: string, code: string) {
    const html = templates.verificationEmail(name, code);
    return await this.sendEmailResend({
      to: email,
      subject: 'Verify Your Email - CrimeSafety',
      html,
    });
  }

  /**
   * Send alert to police for high-severity reports
   */
  static async sendPoliceAlert(report: any) {
    const policeEmails = process.env.POLICE_ALERT_EMAILS?.split(',') || [];
    if (policeEmails.length === 0) return;

    const html = templates.reportAlert(report);
    
    return await this.sendEmailResend({
      to: policeEmails,
      subject: `🚨 URGENT: ${report.severity} Severity Crime Report - Action Required`,
      html,
    });
  }

  /**
   * Send report update notification to user
   */
  static async sendReportUpdateNotification(userEmail: string, report: any, update: any) {
    const html = templates.reportUpdate(report, update);
    
    return await this.sendEmailResend({
      to: userEmail,
      subject: `Update on Your Crime Report #${report.id}`,
      html,
    });
  }

  /**
   * Send bulk safety alerts to users in an area
   */
  static async sendSafetyAlert(emails: string[], alertTitle: string, alertMessage: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9fafb; }
          .alert-box { background: #fff3e0; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Safety Alert</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>${alertTitle}</h2>
              <p>${alertMessage}</p>
            </div>
            <p>Stay vigilant and take necessary precautions.</p>
            <p>For emergencies, always call local authorities immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await this.sendEmailResend({
        to: batch,
        subject: `⚠️ Safety Alert: ${alertTitle}`,
        html,
      });
      // Delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const sendEmail = EmailService.sendEmailResend.bind(EmailService);
export default EmailService;