import { Module } from '@nestjs/common';
import { UnitsController } from './units.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UnitsController]
})
export class UnitsModule {}
