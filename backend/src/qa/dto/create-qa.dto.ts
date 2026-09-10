import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsArray, MaxLength } from 'class-validator';

export class CreateQaDto {
  @ApiProperty({ description: '问题' })
  @IsNotEmpty({ message: '问题不能为空' })
  @IsString()
  @MaxLength(200)
  question: string;

  @ApiProperty({ description: '答案' })
  @IsNotEmpty({ message: '答案不能为空' })
  @IsString()
  answer: string;

  @ApiProperty({ description: '分类' })
  @IsNotEmpty({ message: '分类不能为空' })
  @IsString()
  @MaxLength(50)
  category: string;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '关键词', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}
