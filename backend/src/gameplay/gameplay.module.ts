import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameplayService } from './gameplay.service';
import { GameplayController } from './gameplay.controller';
import { Gameplay } from './entities/gameplay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gameplay])],
  controllers: [GameplayController],
  providers: [GameplayService],
  exports: [GameplayService],
})
export class GameplayModule {}
