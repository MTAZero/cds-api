import { Module } from '@nestjs/common';
import { TrainingController } from './traning.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TrainingController]
})
export class TrainingModule {}
