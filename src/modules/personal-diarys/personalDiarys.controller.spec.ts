import { Test, TestingModule } from '@nestjs/testing';
import { PersonalDiaryController } from './personal-diarys.controller';

describe('PersonalDiaryController', () => {
  let controller: PersonalDiaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalDiaryController],
    }).compile();

    controller = module.get<PersonalDiaryController>(PersonalDiaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});