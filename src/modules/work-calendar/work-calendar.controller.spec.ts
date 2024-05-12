import { Test, TestingModule } from '@nestjs/testing';
import { WorkCalendarController } from './work-calendar.controller';

describe('WorkCalendarController', () => {
  let controller: WorkCalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkCalendarController],
    }).compile();

    controller = module.get<WorkCalendarController>(WorkCalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
