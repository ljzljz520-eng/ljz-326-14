import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GameplayService } from './gameplay.service';
import { CreateGameplayDto } from './dto/create-gameplay.dto';
import { GameMode } from './entities/gameplay.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('玩法')
@Controller('gameplay')
export class GameplayController {
  constructor(private readonly gameplayService: GameplayService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建玩法（管理员）' })
  create(@Body() createGameplayDto: CreateGameplayDto) {
    return this.gameplayService.create(createGameplayDto);
  }

  @Get()
  @ApiOperation({ summary: '获取玩法列表' })
  findAll(@Query('all') all: string) {
    return this.gameplayService.findAll(all !== 'true');
  }

  @Get('featured')
  @ApiOperation({ summary: '获取推荐玩法' })
  findFeatured() {
    return this.gameplayService.findFeatured();
  }

  @Get('mode/:mode')
  @ApiOperation({ summary: '按游戏模式获取玩法' })
  findByGameMode(@Param('mode') mode: GameMode) {
    return this.gameplayService.findByGameMode(mode);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取玩法详情' })
  findOne(@Param('id') id: string) {
    return this.gameplayService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新玩法（管理员）' })
  update(@Param('id') id: string, @Body() updateGameplayDto: Partial<CreateGameplayDto>) {
    return this.gameplayService.update(+id, updateGameplayDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除玩法（管理员）' })
  remove(@Param('id') id: string) {
    return this.gameplayService.remove(+id);
  }
}
