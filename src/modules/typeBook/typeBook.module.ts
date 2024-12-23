import { Module } from '@nestjs/common';
import { TypeBookController } from './typeBook.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TypeBookController],
})
export class TypeBookModule {}
