import { Module } from '@nestjs/common';
import { MeetingBookController } from './meeting-book.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MeetingBookController]
})
export class MeetingBookModule {}
