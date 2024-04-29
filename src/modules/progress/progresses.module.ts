import { Module } from '@nestjs/common';
import { ProgressController } from './progresses.controller';
import { DatabaseModule } from './../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProgressController]
})
export class ProgressesModule {}
