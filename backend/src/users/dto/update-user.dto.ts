import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Minecraft用户名', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  minecraftUsername?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
