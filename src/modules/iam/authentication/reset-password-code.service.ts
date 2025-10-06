import { EmailService } from "@/modules/email/email.service";
import { LessThan, Repository } from "typeorm";

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";

import { ResetPasswordCode } from "./entities/reset-password-code.entity";

@Injectable()
export class ResetPasswordCodeService {
  constructor(
    @InjectRepository(ResetPasswordCode)
    private readonly ResetPasswordCodeRepository: Repository<ResetPasswordCode>,
    private readonly emailService: EmailService,
  ) {}

  // This cron job runs every day at 0:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredResetPasswordCodes() {
    const now = new Date();
    await this.ResetPasswordCodeRepository.delete({
      expireTime: LessThan(now),
    });
  }

  async create(email: string): Promise<ResetPasswordCode> {
    try {
      // Generate a random 6-digit number as a string, padded with zeros if necessary
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expireTime to 1 day from now
      const expireTime = new Date(Date.now() + 864e5); // 24 * 60 * 60 * 1000

      const ResetPasswordCode = this.ResetPasswordCodeRepository.create({
        code,
        expireTime,
        email,
      });
      return await this.ResetPasswordCodeRepository.save(ResetPasswordCode);
    } catch (error) {
      // Throw 500 Internal Server Error if DB error occurs
      throw new InternalServerErrorException(
        "Failed to create reset password code. Please try again.",
      );
    }
  }

  async findOneByCode(code: string): Promise<ResetPasswordCode> {
    const ResetPasswordCode = await this.ResetPasswordCodeRepository.findOne({
      where: { code },
    });

    if (!ResetPasswordCode) {
      throw new NotFoundException("Reset password code not found");
    }
    if (ResetPasswordCode.expireTime.getTime() < Date.now()) {
      await this.delete(code);
      throw new BadRequestException("Reset password code expired");
    }
    return ResetPasswordCode;
  }

  async delete(code: string): Promise<void> {
    await this.ResetPasswordCodeRepository.delete({ code });
  }

  async resetPassword(email: string) {
    // Generate a new invite code, optionally associated with an email
    const ResetPasswordCode = await this.create(email);
    console.log("🚀 ~ ResetPasswordCodeService ~ resetPassword ~ ResetPasswordCode:", ResetPasswordCode)

    if (email) {
      await this.emailService.sendHTMLEmail(
        email,
        "Yêu cầu đặt lại mật khẩu L2brary",
        {
          resetPasswordCode: ResetPasswordCode.code,
        },
        "reset-password",
      );
    }

    return {
      success: true,
      message: "Reset password code created successfully to " + email,
    };
  }
}
