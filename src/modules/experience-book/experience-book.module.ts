import { Module } from '@nestjs/common';
import { ExperienceController } from './experience-book.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ExperienceController]
})
export class ExperienceModule {}
