import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Qa } from './entities/qa.entity';
import { CreateQaDto } from './dto/create-qa.dto';

@Injectable()
export class QaService {
  constructor(
    @InjectRepository(Qa)
    private qaRepository: Repository<Qa>,
  ) {}

  async create(createQaDto: CreateQaDto): Promise<Qa> {
    const qa = this.qaRepository.create(createQaDto);
    return this.qaRepository.save(qa);
  }

  async findAll(onlyActive: boolean = true): Promise<Qa[]> {
    const where = onlyActive ? { isActive: true } : {};
    return this.qaRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findByCategory(category: string): Promise<Qa[]> {
    return this.qaRepository.find({
      where: { category, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getCategories(): Promise<string[]> {
    const result = await this.qaRepository
      .createQueryBuilder('qa')
      .select('DISTINCT qa.category', 'category')
      .where('qa.isActive = :isActive', { isActive: true })
      .getRawMany();
    return result.map((item) => item.category);
  }

  async search(keyword: string): Promise<Qa[]> {
    return this.qaRepository
      .createQueryBuilder('qa')
      .where('qa.isActive = :isActive', { isActive: true })
      .andWhere(
        '(qa.question LIKE :keyword OR qa.answer LIKE :keyword OR qa.keywords LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
      .orderBy('qa.sortOrder', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Qa> {
    const qa = await this.qaRepository.findOne({ where: { id } });
    if (!qa) {
      throw new NotFoundException('问答不存在');
    }
    // 增加浏览次数
    await this.qaRepository.increment({ id }, 'viewCount', 1);
    return qa;
  }

  async update(id: number, updateQaDto: Partial<CreateQaDto>): Promise<Qa> {
    const qa = await this.findOne(id);
    Object.assign(qa, updateQaDto);
    return this.qaRepository.save(qa);
  }

  async remove(id: number): Promise<void> {
    const qa = await this.findOne(id);
    await this.qaRepository.remove(qa);
  }
}
