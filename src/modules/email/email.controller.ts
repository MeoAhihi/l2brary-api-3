// email/email.controller.ts
import { readFileSync } from "fs";
import { compile } from "handlebars";
import path from "path";

import { Body, Controller, Post } from "@nestjs/common";

import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("welcome")
  async sendWelcome() {
    await this.emailService.sendHTMLEmail(
      "viphongly2804@gmail.com",
      "This is the Subject of email",
      { name: "PhongAhihi" },
      "welcome",
    );

    return { message: "Welcome email sent successfully!" };
  }
}
