import { Module } from '@nestjs/common';
import { RegisterLeaveController } from './register-leave.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RegisterLeaveController],
})
export class RegisterLeaveModule {}
