import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { EmailService } from './email.service';
class SendConfirmationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// Sets the base URL for this controller to '/email'
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  // 1. We inject the EmailService directly. No middle-man.
  constructor(private readonly emailService: EmailService) {}

  /**
   * Endpoint for sending a Hack Trinidad Forward confirmation email.
   * The front-end should call this *after* registering the user in Airtable.
   */
  // 2. Creates a POST endpoint at '/email/confirm-registration'
  @Post('confirm-registration')
  // 3. Tell NestJS to return a 200 OK status on success, not 201 Created
  @HttpCode(HttpStatus.OK)
  async sendConfirmationEmail(
    // 4. Validate the incoming JSON body against our DTO
    @Body(new ValidationPipe()) emailDto: SendConfirmationDto,
  ) {
    const { name, email } = emailDto;

    // 5. Call the EmailService directly
    const emailSent = await this.emailService.sendRegistrationConfirmation(
      email,
      name,
    );

    // 6. Return a clear JSON response to the front-end
    if (!emailSent) {
      this.logger.warn(`Failed to send confirmation to ${email}`);
      // You could also make this throw an error
      return {
        success: false,
        message: 'Email failed to send.',
      };
    }

    return {
      success: true,
      message: 'Confirmation email sent successfully.',
    };
  }
}