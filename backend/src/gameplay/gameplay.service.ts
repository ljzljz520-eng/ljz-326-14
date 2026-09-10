import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gameplay, GameMode } from './entities/gameplay.entity';
import { CreateGameplayDto } from './dto/create-gameplay.dto';

@Injectable()
export class GameplayService {
  constructor(
    @InjectRepository(Gameplay)
    private gameplayRepository: Repository<Gameplay>,
  ) {}

  async create(createGameplayDto: CreateGameplayDto): Promise<Gameplay> {
    const gameplay = this.gameplayRepository.create(createGameplayDto);
    return this.gameplayRepository.save(gameplay);
  }

  async findAll(onlyActive: boolean = true): Promise<Gameplay[]> {
    const where = onlyActive ? { isActive: true } : {};
    return this.gameplayRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Gameplay[]> {
    return this.gameplayRepository.find({
      where: { isActive: true, isFeatured: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findByGameMode(gameMode: GameMode): Promise<Gameplay[]> {
    return this.gameplayRepository.find({
      where: { gameMode, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Gameplay> {
    const gameplay = await this.gameplayRepository.findOne({ where: { id } });
    if (!gameplay) {
      throw new NotFoundException('玩法不存在');
    }
    return gameplay;
  }

  async update(id: number, updateGameplayDto: Partial<CreateGameplayDto>): Promise<Gameplay> {
    const gameplay = await this.findOne(id);
    Object.assign(gameplay, updateGameplayDto);
    return this.gameplayRepository.save(gameplay);
  }

  async remove(id: number): Promise<void> {
    const gameplay = await this.findOne(id);
    await this.gameplayRepository.remove(gameplay);
  }
}
