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
import { QaService } from './qa.service';
import { CreateQaDto } from './dto/create-qa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('问答')
@Controller('qa')
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建问答（管理员）' })
  create(@Body() createQaDto: CreateQaDto) {
    return this.qaService.create(createQaDto);
  }

  @Get()
  @ApiOperation({ summary: '获取问答列表' })
  findAll(@Query('all') all: string) {
    return this.qaService.findAll(all !== 'true');
  }

  @Get('categories')
  @ApiOperation({ summary: '获取问答分类' })
  getCategories() {
    return this.qaService.getCategories();
  }

  @Get('search')
  @ApiOperation({ summary: '搜索问答' })
  search(@Query('keyword') keyword: string) {
    return this.qaService.search(keyword);
  }

  @Get('category/:category')
  @ApiOperation({ summary: '按分类获取问答' })
  findByCategory(@Param('category') category: string) {
    return this.qaService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取问答详情' })
  findOne(@Param('id') id: string) {
    return this.qaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新问答（管理员）' })
  update(@Param('id') id: string, @Body() updateQaDto: Partial<CreateQaDto>) {
    return this.qaService.update(+id, updateQaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除问答（管理员）' })
  remove(@Param('id') id: string) {
    return this.qaService.remove(+id);
  }
}
