import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto, authorId: number): Promise<News> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      authorId,
    });
    return this.newsRepository.save(news);
  }

  async findAll(onlyPublished: boolean = true): Promise<News[]> {
    const query = this.newsRepository.createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'author')
      .select([
        'news.id',
        'news.title',
        'news.summary',
        'news.coverImage',
        'news.isPublished',
        'news.isPinned',
        'news.viewCount',
        'news.createdAt',
        'author.id',
        'author.username',
      ])
      .orderBy('news.isPinned', 'DESC')
      .addOrderBy('news.createdAt', 'DESC');

    if (onlyPublished) {
      query.where('news.isPublished = :isPublished', { isPublished: true });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!news) {
      throw new NotFoundException('新闻不存在');
    }
    // 增加浏览次数
    await this.newsRepository.increment({ id }, 'viewCount', 1);
    return news;
  }

  async update(id: number, updateNewsDto: Partial<CreateNewsDto>): Promise<News> {
    const news = await this.findOne(id);
    Object.assign(news, updateNewsDto);
    return this.newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }

  async getLatest(limit: number = 5): Promise<News[]> {
    return this.newsRepository.find({
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
      take: limit,
      select: ['id', 'title', 'summary', 'coverImage', 'createdAt'],
    });
  }
}
