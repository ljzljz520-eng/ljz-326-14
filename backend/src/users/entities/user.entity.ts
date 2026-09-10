import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, nullable: true })
  minecraftUsername: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ length: 100, nullable: true })
  verificationToken: string;

  @Column({ length: 100, nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpires: Date;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ default: 0 })
  playTime: number; // 游戏时长（分钟）

  @Column({ default: 0 })
  achievements: number; // 成就数量

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
