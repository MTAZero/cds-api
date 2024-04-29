import { Module } from '@nestjs/common';
import { GuardDuttyController } from './guard-dutty.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GuardDuttyController],
})
export class GuardDuttyModule {}
