import { Test, TestingModule } from '@nestjs/testing';
import { GuardDuttyController } from './guard-dutty.controller';

describe('GuardDuttyController', () => {
  let controller: GuardDuttyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardDuttyController],
    }).compile();

    controller = module.get<GuardDuttyController>(GuardDuttyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
