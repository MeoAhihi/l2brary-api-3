import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { InviteCode } from "./entities/invite-code.entity";

@Injectable()
export class InviteCodeService {
  constructor(
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: Repository<InviteCode>
  ) {}

  // This cron job runs every day at 0:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredInviteCodes() {
    const now = new Date();
    await this.inviteCodeRepository.delete({
      expireTime: LessThan(now),
    });
  }

  async create(email?: string): Promise<InviteCode> {
    try {
      // Generate a random 6-digit number as a string, padded with zeros if necessary
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expireTime to 1 day from now
      const expireTime = new Date(Date.now() + 864e5); // 24 * 60 * 60 * 1000

      const inviteCode = this.inviteCodeRepository.create({
        code,
        expireTime,
        email,
      });
      return await this.inviteCodeRepository.save(inviteCode);
    } catch (error) {
      // Throw 500 Internal Server Error if DB error occurs
      throw new InternalServerErrorException(
        "Failed to create invite code. Please try again."
      );
    }
  }

  async findOneByCode(code: string): Promise<InviteCode> {
    const inviteCode = await this.inviteCodeRepository.findOne({
      where: { code },
    });

    if (!inviteCode) {
      throw new NotFoundException("Invite code not found");
    }
    if (inviteCode.expireTime.getTime() < Date.now()) {
      await this.delete(code);
      throw new BadRequestException("Invite code expired");
    }
    return inviteCode;
  }

  async delete(code: string): Promise<void> {
    await this.inviteCodeRepository.delete({ code });
  }

  async invite(email?: string) {
    // Generate a new invite code, optionally associated with an email
    const inviteCode = await this.create(email);

    if (email) {
      console.log(
        `Email sent to ${email}:\nPlease use this code to register: "${inviteCode.code}"`
      );
    }

    return {
      message: "Invite code created successfully.",
      inviteCode,
    };
  }
}
