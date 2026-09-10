import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('公告')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建公告（管理员）' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Get()
  @ApiOperation({ summary: '获取公告列表' })
  findAll(@Query('all') all: string) {
    return this.announcementsService.findAll(all !== 'true');
  }

  @Get('latest')
  @ApiOperation({ summary: '获取最新公告' })
  getLatest(@Query('limit') limit: string) {
    return this.announcementsService.getLatest(limit ? parseInt(limit) : 3);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取公告详情' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新公告（管理员）' })
  update(@Param('id') id: string, @Body() updateAnnouncementDto: Partial<CreateAnnouncementDto>) {
    return this.announcementsService.update(+id, updateAnnouncementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除公告（管理员）' })
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(+id);
  }
}
