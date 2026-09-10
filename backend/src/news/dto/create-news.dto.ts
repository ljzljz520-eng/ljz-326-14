import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '摘要', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: '封面图片', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: '是否发布', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ description: '是否置顶', required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
