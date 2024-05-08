import { Module } from '@nestjs/common';
import { GuardDuttyController } from './guard-dutty.controller';
import { DatabaseModule } from '../database/database.module';
import { GuardDuttyService } from './guard-dutty.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  controllers: [GuardDuttyController],
  providers: [GuardDuttyService],
})
export class GuardDuttyModule {}
