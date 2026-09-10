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

  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const token = uuidv4();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1小时后过期
    await this.usersRepository.save(user);
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return false;
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = '';
    user.resetPasswordExpires = null as unknown as Date;
    await this.usersRepository.save(user);
    return true;
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
