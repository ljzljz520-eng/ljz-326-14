import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('排行榜')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly usersService: UsersService) {}

  @Get('playtime')
  @ApiOperation({ summary: '获取游戏时长排行榜' })
  getPlaytimeLeaderboard(@Query('limit') limit: string) {
    return this.usersService.getLeaderboard('playTime', limit ? parseInt(limit) : 10);
  }

  @Get('achievements')
  @ApiOperation({ summary: '获取成就排行榜' })
  getAchievementsLeaderboard(@Query('limit') limit: string) {
    return this.usersService.getLeaderboard('achievements', limit ? parseInt(limit) : 10);
  }
}
