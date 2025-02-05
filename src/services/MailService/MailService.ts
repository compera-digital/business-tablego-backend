import nodemailer from 'nodemailer';
import { IMailService, IMailServiceDependencies } from './types';

export class MailService implements IMailService {
  private readonly logger;
  private readonly config;
  private readonly emailUser;
  private readonly emailPass;
  private readonly transporter;

  constructor({ config, logger }: IMailServiceDependencies) {
    this.config = config;
    this.emailUser = config.user;
    this.emailPass = config.pass;
    this.config.server = config.server;
    this.config.port = config.port;
    this.logger = logger;

    this.transporter = nodemailer.createTransport({
      host: this.config.server,
      port: this.config.port,
      service: "gmail",
      secure: true,
      auth: {
        user: this.emailUser,
        pass: this.emailPass,
      },
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Email Verification',
        html: `
          <h1>Email Verification</h1>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 15 minutes.</p>
        `,
      });

      this.logger.info('Verification email sent successfully', { to });
    } catch (error) {
      this.logger.error('Error sending verification email', error as Error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Welcome to Our Platform',
        html: `
          <h1>Welcome ${name}!</h1>
          <p>Thank you for joining our platform.</p>
        `,
      });

      this.logger.info('Welcome email sent successfully', { to });
    } catch (error) {
      this.logger.error('Error sending welcome email', error as Error);
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        `,
      });

      this.logger.info('Password reset email sent successfully', { to });
    } catch (error) {
      this.logger.error('Error sending password reset email', error as Error);
      throw error;
    }
  }
} 