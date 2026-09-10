import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('用户名已存在');
      }
      throw new ConflictException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const verificationToken = uuidv4();

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      verificationToken,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'minecraftUsername', 'role', 'emailVerified', 'playTime', 'achievements', 'avatar', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { verificationToken: token },
    });
    if (!user) {
      return false;
    }
    user.emailVerified = true;
    user.verificationToken = '';
    await this.usersRepository.save(user);
    return true;
  }

  /**
   * 创建密码重置凭证（链接 token + 6位数字验证码），两者共享 1 小时有效期。
   * 账号不存在时抛出 NotFoundException，由上层转成明确的业务提示。
   */
  async createPasswordResetToken(email: string): Promise<{ token: string; code: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('该邮箱未注册，请检查邮箱或先注册账号');
    }
    const token = uuidv4();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = token;
    user.resetPasswordCode = await bcrypt.hash(code, 10);
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1小时后过期
    await this.usersRepository.save(user);
    return { token, code };
  }

  /**
   * 校验重置链接的 token 是否有效（未使用、未过期）。
   * 返回 'valid' | 'expired' | 'invalid'
   */
  async validateResetToken(token: string): Promise<'valid' | 'expired' | 'invalid'> {
    if (!token) {
      return 'invalid';
    }
    const user = await this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user) {
      return 'invalid';
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return 'expired';
    }
    return 'valid';
  }

  /**
   * 通过邮箱 + 6位验证码定位待重置用户。
   */
  private async findUserByResetCode(
    email: string,
    code: string,
  ): Promise<{ status: 'ok'; user: User } | { status: 'expired' | 'invalid' }> {
    const user = await this.findByEmail(email);
    if (!user || !user.resetPasswordCode) {
      return { status: 'invalid' };
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return { status: 'expired' };
    }
    const codeMatches = await bcrypt.compare(code, user.resetPasswordCode);
    if (!codeMatches) {
      return { status: 'invalid' };
    }
    return { status: 'ok', user };
  }

  /**
   * 重置密码。
   * - 通过 token（邮件链接）或 email + code（验证码）校验身份；
   * - 新密码与旧密码相同时返回 'same_password'；
   * - 成功后立即作废凭证，保证链接/验证码只能使用一次。
   */
  async resetPassword(options: {
    token?: string;
    email?: string;
    code?: string;
    newPassword: string;
  }): Promise<'ok' | 'expired' | 'invalid' | 'same_password'> {
    let user: User | null = null;

    if (options.token) {
      const found = await this.usersRepository.findOne({
        where: { resetPasswordToken: options.token },
      });
      if (!found) {
        return 'invalid';
      }
      if (!found.resetPasswordExpires || found.resetPasswordExpires < new Date()) {
        return 'expired';
      }
      user = found;
    } else if (options.email && options.code) {
      const result = await this.findUserByResetCode(options.email, options.code);
      if (result.status !== 'ok') {
        return result.status;
      }
      user = result.user;
    } else {
      return 'invalid';
    }

    if (await bcrypt.compare(options.newPassword, user.password)) {
      return 'same_password';
    }

    user.password = await bcrypt.hash(options.newPassword, 10);
    user.resetPasswordToken = '';
    user.resetPasswordCode = '';
    user.resetPasswordExpires = null as unknown as Date;
    await this.usersRepository.save(user);
    return 'ok';
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.usersRepository.update(id, { lastLoginAt: new Date() });
  }

  async getLeaderboard(type: 'playTime' | 'achievements', limit: number = 10): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'minecraftUsername', 'avatar', 'playTime', 'achievements'],
      order: { [type]: 'DESC' },
      take: limit,
    });
  }
}
