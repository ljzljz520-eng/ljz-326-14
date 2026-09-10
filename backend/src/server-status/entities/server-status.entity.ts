import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('server_status')
export class ServerStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isOnline: boolean;

  @Column({ default: 0 })
  onlinePlayers: number;

  @Column({ default: 100 })
  maxPlayers: number;

  @Column({ length: 100, nullable: true })
  serverIp: string;

  @Column({ default: 25565 })
  serverPort: number;

  @Column({ length: 50, nullable: true })
  version: string;

  @Column({ length: 200, nullable: true })
  motd: string;

  @Column({ type: 'float', nullable: true })
  tps: number;

  @Column({ type: 'bigint', nullable: true })
  uptime: number;

  @CreateDateColumn()
  recordedAt: Date;
}
