import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerStatus } from './entities/server-status.entity';

@Injectable()
export class ServerStatusService {
  constructor(
    @InjectRepository(ServerStatus)
    private serverStatusRepository: Repository<ServerStatus>,
  ) {}

  async getCurrentStatus(): Promise<ServerStatus | null> {
    return this.serverStatusRepository.findOne({
      where: {},
      order: { recordedAt: 'DESC' },
    });
  }

  async getStatusHistory(limit: number = 24): Promise<ServerStatus[]> {
    return this.serverStatusRepository.find({
      order: { recordedAt: 'DESC' },
      take: limit,
    });
  }

  async recordStatus(statusData: Partial<ServerStatus>): Promise<ServerStatus> {
    const status = this.serverStatusRepository.create(statusData);
    return this.serverStatusRepository.save(status);
  }

  async getServerInfo(): Promise<any> {
    const currentStatus = await this.getCurrentStatus();
    return {
      serverIp: currentStatus?.serverIp || 'mc.example.com',
      serverPort: currentStatus?.serverPort || 25565,
      version: currentStatus?.version || '1.20.4',
      isOnline: currentStatus?.isOnline ?? true,
      onlinePlayers: currentStatus?.onlinePlayers || 0,
      maxPlayers: currentStatus?.maxPlayers || 100,
      motd: currentStatus?.motd || '欢迎来到Minecraft服务器!',
      tps: currentStatus?.tps || 20.0,
      uptime: currentStatus?.uptime || 0,
    };
  }

  async updateStatus(statusData: Partial<ServerStatus>): Promise<ServerStatus> {
    // 获取最新状态或创建新状态
    let status = await this.getCurrentStatus();
    if (status) {
      Object.assign(status, statusData);
    } else {
      status = this.serverStatusRepository.create(statusData);
    }
    return this.serverStatusRepository.save(status);
  }
}
