import { Module } from '@nestjs/common';
import { AccessControlController } from './accessControl.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccessControlController],
})
export class AccessControlModule {}
