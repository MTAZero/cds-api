import { Module } from '@nestjs/common';
import { GoingCallController } from './goingCall.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GoingCallController],
})
export class GoingCallModule {}
