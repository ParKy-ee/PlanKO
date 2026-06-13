import { Module } from '@nestjs/common';
import { QuestByUesrService } from './quest-by-uesr.service';
import { QuestByUesrController } from './quest-by-uesr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestByUser } from './entities/quest-by-uesr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestByUser])],
  controllers: [QuestByUesrController],
  providers: [QuestByUesrService],
})
export class QuestByUesrModule {}
