import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { GameMode } from '../entities/gameplay.entity';

export class CreateGameplayDto {
  @ApiProperty({ description: '标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: '描述' })
  @IsNotEmpty({ message: '描述不能为空' })
  @IsString()
  description: string;

  @ApiProperty({ description: '详细内容', required: false })
  @IsOptional()
  @IsString()
  detailedContent?: string;

  @ApiProperty({ description: '游戏模式', enum: GameMode, required: false })
  @IsOptional()
  @IsEnum(GameMode)
  gameMode?: GameMode;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '封面图片', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '是否推荐', required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
