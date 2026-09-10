import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: '重置令牌' })
  @IsNotEmpty({ message: '令牌不能为空' })
  @IsString()
  token: string;

  @ApiProperty({ description: '新密码', example: 'NewPassword123!' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @MinLength(8, { message: '密码至少8个字符' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: '密码必须包含大小写字母、数字和特殊字符',
    },
  )
  password: string;
}
