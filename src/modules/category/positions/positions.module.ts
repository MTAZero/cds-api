import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '../../database/database.module';
import { PositionDBService } from 'src/modules/database/services/positionDBService';

@Module({
  imports: [DatabaseModule],
  controllers: [PositionsController]
})
export class PositionsModule {}
