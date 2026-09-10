import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('新闻')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新闻（管理员）' })
  create(@Body() createNewsDto: CreateNewsDto, @Request() req: any) {
    return this.newsService.create(createNewsDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '获取新闻列表' })
  findAll(@Query('all') all: string) {
    return this.newsService.findAll(all !== 'true');
  }

  @Get('latest')
  @ApiOperation({ summary: '获取最新新闻' })
  getLatest(@Query('limit') limit: string) {
    return this.newsService.getLatest(limit ? parseInt(limit) : 5);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取新闻详情' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新新闻（管理员）' })
  update(@Param('id') id: string, @Body() updateNewsDto: Partial<CreateNewsDto>) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除新闻（管理员）' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
