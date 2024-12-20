import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyPlanDetailController } from './monthly-plan-detail.controller';

describe('MonthlyPlanDetailController', () => {
  let controller: MonthlyPlanDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyPlanDetailController],
    }).compile();

    controller = module.get<MonthlyPlanDetailController>(MonthlyPlanDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
