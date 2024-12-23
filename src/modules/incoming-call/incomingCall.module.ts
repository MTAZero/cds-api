import { Module } from '@nestjs/common';
import { IncomingCallController } from './incomingCall.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncomingCallController],
})
export class IncomingCallModule {}
