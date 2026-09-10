import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { AnnouncementType } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '类型', enum: AnnouncementType, required: false })
  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '是否置顶', required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiProperty({ description: '开始时间', required: false })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiProperty({ description: '结束时间', required: false })
  @IsOptional()
  @IsDateString()
  endAt?: string;
}
