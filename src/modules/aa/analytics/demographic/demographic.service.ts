import { User } from "@/modules/iam/user/entities/user.entity";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class DemographicService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async countUsersByRank(): Promise<{ rank: string; count: number }[]> {
    const result = await this.userRepository
      .createQueryBuilder("user")
      .select("user.rank", "rank")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.rank")
      .getRawMany();

    // Ensure count is a number
    return result.map((row) => ({
      rank: row.rank,
      count: Number(row.count),
    }));
  }

  async countUsersByGender(): Promise<{ gender: string; count: number }[]> {
    const result = await this.userRepository
      .createQueryBuilder("user")
      .select("user.gender", "gender")
      .addSelect("COUNT(*)", "count")
      .groupBy("user.gender")
      .getRawMany();

    // Ensure count is a number
    return result.map((row) => ({
      gender: row.gender,
      count: Number(row.count),
    }));
  }

  async countUsersByAge(): Promise<{ age: number; count: number }[]> {
    // Postgres-specific: Calculate integer age based on birthdate
    // Use age(CURRENT_DATE, user.birthdate) to get interval, then extract years and cast to integer
    // Group users by integer age using Postgres age() and extract(years)
    const result = await this.userRepository
      .createQueryBuilder("user")
      .select("EXTRACT(YEAR FROM AGE(CURRENT_DATE, user.birthdate))", "age")
      .addSelect("COUNT(*)", "count")
      .where("user.birthdate IS NOT NULL")
      .groupBy("age")
      .orderBy("age", "ASC")
      .getRawMany();

    // Ensure count and age are numbers
    return result.map((row) => ({
      age: Number(row.age),
      count: Number(row.count),
    }));
  }
  F;
}
