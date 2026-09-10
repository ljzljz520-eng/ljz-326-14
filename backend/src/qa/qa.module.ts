import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { Qa } from './entities/qa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qa])],
  controllers: [QaController],
  providers: [QaService],
  exports: [QaService],
})
export class QaModule {}
