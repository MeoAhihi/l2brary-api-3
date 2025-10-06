// email/email.service.ts
import { MailerService } from "@nestjs-modules/mailer";
import { readFileSync } from "fs";
import { compile } from "handlebars";

import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendHTMLEmail(
    to: string,
    subject: string,
    input: Record<string, string>,
    templateFile: string,
  ) {
    const templateSource = readFileSync(
      `./src/templates/${templateFile}.hbs`,
      "utf8",
    );
    const template = compile(templateSource);
    const html = template(input);

    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }
}
