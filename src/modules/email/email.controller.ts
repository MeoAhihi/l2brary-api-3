// email/email.controller.ts
import { Body, Controller, Post } from "@nestjs/common";

import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("welcome")
  async sendWelcome() {
    await this.emailService.sendPlainTextEmail("viphongly2804@gmail.com" , "This is the Subject of email", "This is the content of the email that I added");
    return { message: "Welcome email sent successfully!" };
  }
}
