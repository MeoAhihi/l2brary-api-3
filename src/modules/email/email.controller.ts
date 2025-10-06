// email/email.controller.ts
import { Body, Controller, Post } from "@nestjs/common";

import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("welcome")
  async sendWelcome() {
    const name = "Wind Ly";

    const content = "";
    await this.emailService.sendPlainTextEmail(
      "viphongly2804@gmail.com",
      "This is the Subject of email",
      content,
    );
    return { message: "Welcome email sent successfully!" };
  }
}
