import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { QaModule } from './qa/qa.module';
import { ServerStatusModule } from './server-status/server-status.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { GameplayModule } from './gameplay/gameplay.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get('DATABASE_USER', 'minecraft'),
        password: configService.get('DATABASE_PASSWORD', 'minecraft123456'),
        database: configService.get('DATABASE_NAME', 'minecraft_server'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    NewsModule,
    QaModule,
    ServerStatusModule,
    LeaderboardModule,
    AnnouncementsModule,
    GameplayModule,
  ],
})
export class AppModule {}
