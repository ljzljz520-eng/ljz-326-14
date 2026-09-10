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
    // 账号不存在时直接抛出异常，前端给出明确的"账号不存在"提示
    const credentials = await this.usersService.createPasswordResetToken(
      forgotPasswordDto.email,
    );
    // 这里应集成邮件发送服务（重置链接 + 验证码）
    // 目前开发模式下随接口返回，便于联调测试
    const resetLink = `/reset-password?token=${credentials.token}`;
    return {
      message: '重置链接和验证码已发送到您的邮箱，请注意查收（1小时内有效）',
      resetLink,
      resetToken: credentials.token, // 仅用于测试，生产环境不应返回
      resetCode: credentials.code, // 仅用于测试，生产环境不应返回
      expiresIn: 3600,
    };
  }

  async validateResetToken(token: string) {
    const status = await this.usersService.validateResetToken(token);
    return {
      valid: status === 'valid',
      status,
      message:
        status === 'valid'
          ? '链接有效'
          : status === 'expired'
            ? '重置链接已过期，请重新申请'
            : '重置链接无效，请重新申请',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hasToken = !!resetPasswordDto.token;
    const hasCodeCredentials = !!resetPasswordDto.email && !!resetPasswordDto.code;
    if (!hasToken && !hasCodeCredentials) {
      throw new BadRequestException('请提供有效的重置链接，或填写邮箱与验证码');
    }

    const result = await this.usersService.resetPassword({
      token: resetPasswordDto.token,
      email: resetPasswordDto.email,
      code: resetPasswordDto.code,
      newPassword: resetPasswordDto.password,
    });

    switch (result) {
      case 'ok':
        return { message: '密码重置成功，请使用新密码重新登录' };
      case 'same_password':
        throw new BadRequestException('新密码不能与旧密码相同，请更换一个新密码');
      case 'expired':
        throw new BadRequestException('重置链接或验证码已过期，请重新申请');
      default:
        throw new BadRequestException('重置链接或验证码无效，请重新申请');
    }
  }
}
