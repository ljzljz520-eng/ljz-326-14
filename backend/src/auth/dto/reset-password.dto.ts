import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: '重置令牌（来自邮件链接，与验证码二选一）',
    required: false,
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    description: '邮箱（使用验证码方式重置时必填）',
    required: false,
    example: 'player@example.com',
  })
  @ValidateIf((o) => !o.token)
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;

  @ApiProperty({
    description: '6位数字验证码（与重置链接 token 二选一）',
    required: false,
    example: '123456',
  })
  @ValidateIf((o) => !o.token)
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString()
  @Matches(/^\d{6}$/, { message: '验证码必须是6位数字' })
  code?: string;

  @ApiProperty({ description: '新密码', example: 'NewPassword123!' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @MaxLength(50, { message: '密码最多50个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: '密码必须包含大小写字母、数字和特殊字符',
    },
  )
  password: string;
}
