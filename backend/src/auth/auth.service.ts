import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const { password: _, ...result } = user;
    return {
      message: '注册成功，请查收邮件验证您的账户',
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    
    await this.usersService.updateLastLogin(user.id);
    
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      message: '登录成功',
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        minecraftUsername: user.minecraftUsername,
        avatar: user.avatar,
      },
    };
  }

  async verifyEmail(token: string) {
    const result = await this.usersService.verifyEmail(token);
    if (!result) {
      throw new BadRequestException('无效的验证链接');
    }
    return { message: '邮箱验证成功' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const token = await this.usersService.createPasswordResetToken(
      forgotPasswordDto.email,
    );
    if (token) {
      // 这里可以集成邮件发送服务
      // 目前仅返回token用于测试
      return {
        message: '密码重置链接已发送到您的邮箱',
        // 仅用于测试，生产环境应该发送邮件
        resetToken: token,
      };
    }
    // 即使邮箱不存在也返回相同信息，防止枚举攻击
    return { message: '如果邮箱存在，密码重置链接已发送' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const result = await this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    if (!result) {
      throw new BadRequestException('重置链接无效或已过期');
    }
    return { message: '密码重置成功' };
  }
}
