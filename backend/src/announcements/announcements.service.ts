import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Or } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementRepository.create(createAnnouncementDto);
    return this.announcementRepository.save(announcement);
  }

  async findAll(onlyActive: boolean = true): Promise<Announcement[]> {
    if (!onlyActive) {
      return this.announcementRepository.find({
        order: { isPinned: 'DESC', createdAt: 'DESC' },
      });
    }

    const now = new Date();
    return this.announcementRepository
      .createQueryBuilder('announcement')
      .where('announcement.isActive = :isActive', { isActive: true })
      .andWhere(
        '(announcement.startAt IS NULL OR announcement.startAt <= :now)',
        { now },
      )
      .andWhere(
        '(announcement.endAt IS NULL OR announcement.endAt >= :now)',
        { now },
      )
      .orderBy('announcement.isPinned', 'DESC')
      .addOrderBy('announcement.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({ where: { id } });
    if (!announcement) {
      throw new NotFoundException('公告不存在');
    }
    return announcement;
  }

  async update(id: number, updateAnnouncementDto: Partial<CreateAnnouncementDto>): Promise<Announcement> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, updateAnnouncementDto);
    return this.announcementRepository.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  async getLatest(limit: number = 3): Promise<Announcement[]> {
    const now = new Date();
    return this.announcementRepository
      .createQueryBuilder('announcement')
      .where('announcement.isActive = :isActive', { isActive: true })
      .andWhere(
        '(announcement.startAt IS NULL OR announcement.startAt <= :now)',
        { now },
      )
      .andWhere(
        '(announcement.endAt IS NULL OR announcement.endAt >= :now)',
        { now },
      )
      .orderBy('announcement.isPinned', 'DESC')
      .addOrderBy('announcement.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }
}
