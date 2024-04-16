import { Test, TestingModule } from '@nestjs/testing';
import { TroopReportController } from './troop-report.controller';

describe('TroopReportController', () => {
  let controller: TroopReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TroopReportController],
    }).compile();

    controller = module.get<TroopReportController>(TroopReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
