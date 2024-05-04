import { Module } from '@nestjs/common';
import { PersonalDiaryController } from './personal-diarys.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PersonalDiaryController]
})
export class PersonalDiaryModule {}
