import { Injectable } from '@nestjs/common';
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
  }

  // We'll add our method to send emails here later.
}