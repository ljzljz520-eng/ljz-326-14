import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('qa')
export class Qa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ length: 50 })
  category: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
