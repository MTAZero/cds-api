import { Module } from '@nestjs/common';
import { StatisticDocumentController } from './statisticDocument.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StatisticDocumentController],
})
export class StatisticDocumentModule {}
