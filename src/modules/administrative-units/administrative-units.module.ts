import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AdministrativeUnitsController } from './administrative-units.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [AdministrativeUnitsController],
})
export class AdministrativeUnitsModule {}
