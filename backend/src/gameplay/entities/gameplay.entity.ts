import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum GameMode {
  SURVIVAL = 'survival',
  CREATIVE = 'creative',
  ADVENTURE = 'adventure',
  SPECTATOR = 'spectator',
}

@Entity('gameplay')
export class Gameplay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  detailedContent: string;

  @Column({ type: 'enum', enum: GameMode, nullable: true })
  gameMode: GameMode;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  coverImage: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
