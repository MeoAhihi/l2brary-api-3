// email/email.service.ts
import { MailerService } from "@nestjs-modules/mailer";

import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: "Welcome to Our App 🎉",
      template: "./welcome", // refers to "templates/email/welcome.hbs"
      context: {
        name,
      },
    });
  }

  async sendPlainTextEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
}
