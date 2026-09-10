import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
