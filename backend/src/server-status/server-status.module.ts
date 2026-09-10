import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerStatusService } from './server-status.service';
import { ServerStatusController } from './server-status.controller';
import { ServerStatus } from './entities/server-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerStatus])],
  controllers: [ServerStatusController],
  providers: [ServerStatusService],
  exports: [ServerStatusService],
})
export class ServerStatusModule {}
