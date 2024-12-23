import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyPlanController } from './monthly-plan.controller';

describe('MonthlyPlanController', () => {
  let controller: MonthlyPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyPlanController],
    }).compile();

    controller = module.get<MonthlyPlanController>(MonthlyPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
