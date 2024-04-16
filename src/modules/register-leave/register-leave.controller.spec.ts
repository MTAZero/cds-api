import { Test, TestingModule } from '@nestjs/testing';
import { RegisterLeaveController } from './register-leave.controller';

describe('RegisterLeaveController', () => {
  let controller: RegisterLeaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterLeaveController],
    }).compile();

    controller = module.get<RegisterLeaveController>(RegisterLeaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
