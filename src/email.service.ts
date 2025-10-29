import { Injectable,Logger} from '@nestjs/common';
import * as nodemailer from "nodemailer"
import MailgunTransport from 'mailgun-nodemailer-transport';
// The @Injectable() decorator marks this class as one that NestJS
// can manage and "inject" into other services or controllers.
@Injectable()
export class EmailService {

  // A private property to hold the nodemailer "transporter"
  // This is the object that actually sends the email.
  private transporter: nodemailer.Transporter;

  // A logger to print helpful messages and errors to the console
  private readonly logger = new Logger(EmailService.name);

  // The constructor is a special function that runs once
  // when the EmailService is first created.
  constructor() {
    // We'll put our setup logic here in the next step.
    // 1. Get Mailgun credentials from environment variables
    const domain = process.env.MAILGUN_DOMAIN;
    const apiKey = process.env.MAILGUN_API_KEY;

    // 2. Check if the keys are missing
    if (!domain || !apiKey) {
      // 3. If they are, log a clear error message.
      // This helps debug setup issues *immediately*.
      this.logger.error(
        'Missing Mailgun credentials. Set MAILGUN_DOMAIN and MAILGUN_API_KEY in .env',
      );
      // We 'return' early to stop the constructor from running
      // and trying to connect with no credentials.
      return;
    }
// 4. Initialize the transporter using Mailgun
    this.transporter = nodemailer.createTransport(
      new MailgunTransport({
        auth: {
          domain: domain,
          apiKey: apiKey,
        },
      }),
    );
    // 5. Verify the connection configuration
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection error:', error);
      } else {
        this.logger.log('SMTP server is ready to send messages');
      }
    });

  // We'll add our method to send emails here later.
  }
  // ... (inside the EmailService class, after the constructor) ...

  /**
   * Sends a registration confirmation email for Hack Trinidad Forward.
   * @param recipientEmail - The email address of the person who registered.
   * @param recipientName - The name of the person who registered.
   */
  async sendRegistrationConfirmation(
    recipientEmail: string,
    recipientName: string,
  ): Promise<boolean> {
    // 1. Define the "from" address
    const fromEmail = process.env.EMAIL_FROM || 'no-reply@hacktrinidad.com';

    // 2. Create the HTML body for the email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a4a4a;">Welcome to Hack Trinidad Forward!</h2>
        <p>Hi ${recipientName},</p>
        <p>Thank you for registering for <strong>Hack Trinidad Forward</strong>! We're excited to have you join us.</p>
        <p>We'll be in touch soon with more details about the event.</p>
        <p>See you soon,<br>The Hack Trinidad Forward Team</p>
      </div>
    `;

    // 3. Create the main mailOptions object
    const mailOptions = {
      from: `Hack Trinidad Forward <${fromEmail}>`, // e.g., "Hack Trinidad Forward <team@hacktrinidad.com>"
      to: recipientEmail,
      subject: 'Your Registration for Hack Trinidad Forward is Confirmed!',
      html: htmlBody,
    };
    // We'll build the email here.
    // 4. Use a try/catch block to send the email and handle errors
    try {
      // 5. Send the mail! We "await" this promise.
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Registration email sent to ${recipientEmail}`);
      return true; // Success!

    } catch (error) {
      // 6. If sendMail fails, it "throws" an error.
      // We "catch" it here.
      this.logger.error(
        `Error sending registration email to ${recipientEmail}:`,
        error,
      );
      return false; // Failure!
    }
  }

}
