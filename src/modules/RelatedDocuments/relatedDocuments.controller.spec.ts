import { Test, TestingModule } from '@nestjs/testing';
import { RelatedDocumentController } from './relatedDocuments.controller';

describe('RelatedDocumentController', () => {
  let controller: RelatedDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatedDocumentController],
    }).compile();

    controller = module.get<RelatedDocumentController>(RelatedDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});