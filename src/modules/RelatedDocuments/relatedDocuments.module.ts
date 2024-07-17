import { Module } from '@nestjs/common';
import { RelatedDocumentController } from './relatedDocuments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RelatedDocumentController]
})
export class RelatedDocumentModule {}
