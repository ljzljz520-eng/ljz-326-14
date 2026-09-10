import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    // 检查是否已有用户
    const userCount = await this.userRepository.count();
    
    if (userCount === 0) {
      console.log('Seeding database with initial users...');
      const hashedPassword = await bcrypt.hash('123456', 10);

      const users = [
        {
          username: 'admin',
          email: 'admin@minecraft.com',
          password: hashedPassword,
          role: UserRole.ADMIN,
          emailVerified: true,
          minecraftUsername: 'AdminSteve',
          playTime: 10000,
          achievements: 50,
        },
        {
          username: 'player1',
          email: 'player1@example.com',
          password: hashedPassword,
          role: UserRole.USER,
          emailVerified: true,
          minecraftUsername: 'DiamondMiner',
          playTime: 5000,
          achievements: 30,
        },
        {
          username: 'player2',
          email: 'player2@example.com',
          password: hashedPassword,
          role: UserRole.USER,
          emailVerified: true,
          minecraftUsername: 'CreeperHunter',
          playTime: 3500,
          achievements: 25,
        },
        {
          username: 'player3',
          email: 'player3@example.com',
          password: hashedPassword,
          role: UserRole.USER,
          emailVerified: true,
          minecraftUsername: 'RedstoneWizard',
          playTime: 8000,
          achievements: 45,
        },
        {
          username: 'player4',
          email: 'player4@example.com',
          password: hashedPassword,
          role: UserRole.USER,
          emailVerified: true,
          minecraftUsername: 'BuildMaster',
          playTime: 6000,
          achievements: 35,
        },
      ];

      for (const userData of users) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
        console.log(`Created user: ${userData.username}`);
      }

      console.log('Database seeding completed');
    } else {
      // 确保所有测试用户密码正确
      const hashedPassword = await bcrypt.hash('123456', 10);
      const testEmails = [
        'admin@minecraft.com',
        'player1@example.com',
        'player2@example.com',
        'player3@example.com',
        'player4@example.com',
      ];

      for (const email of testEmails) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
          user.password = hashedPassword;
          await this.userRepository.save(user);
          console.log(`Password reset for: ${email}`);
        }
      }
      console.log('All test user passwords have been reset to: 123456');
    }
  }
}
