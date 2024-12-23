import { Module } from '@nestjs/common';
import { HuanLuyenController } from './huan-luyen.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HuanLuyenController],
})
export class HuanLuyenModule {}
