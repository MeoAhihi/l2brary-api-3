import { Repository } from "typeorm";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { SessionService } from "../session/session.service";
import { Game } from "./entities/game.entity";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly sessionService: SessionService,
  ) {}

  async create(sessionId: number): Promise<Game> {
    const session = await this.sessionService.findOne(sessionId);
    const game = this.gameRepository.create({
      session,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.gameRepository.save(game);
  }

  async findAll(sessionId?: number): Promise<Game[]> {
    const where = sessionId ? { session: { id: sessionId } } : {};
    return this.gameRepository.find({
      where,
      relations: ["gameLogs"],
    });
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ["session", "gameLogs"],
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  async update(id: number, updateGameDto: Partial<Game>): Promise<Game> {
    const game = await this.findOne(id);
    Object.assign(game, updateGameDto);
    game.updatedAt = new Date();
    return this.gameRepository.save(game);
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    game.deletedAt = new Date();
    await this.gameRepository.save(game);
  }
}
