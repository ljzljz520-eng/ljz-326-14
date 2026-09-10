import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServerStatusService } from './server-status.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('服务器状态')
@Controller('server-status')
export class ServerStatusController {
  constructor(private readonly serverStatusService: ServerStatusService) {}

  @Get()
  @ApiOperation({ summary: '获取当前服务器状态' })
  getCurrentStatus() {
    return this.serverStatusService.getCurrentStatus();
  }

  @Get('info')
  @ApiOperation({ summary: '获取服务器信息' })
  getServerInfo() {
    return this.serverStatusService.getServerInfo();
  }

  @Get('history')
  @ApiOperation({ summary: '获取服务器状态历史' })
  getStatusHistory(@Query('limit') limit: string) {
    return this.serverStatusService.getStatusHistory(limit ? parseInt(limit) : 24);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新服务器状态（管理员）' })
  updateStatus(@Body() statusData: any) {
    return this.serverStatusService.updateStatus(statusData);
  }
}
