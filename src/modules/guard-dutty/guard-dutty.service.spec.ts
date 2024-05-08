import { Test, TestingModule } from '@nestjs/testing';
import { GuardDuttyService } from './guard-dutty.service';

describe('GuardDuttyService', () => {
  let service: GuardDuttyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardDuttyService],
    }).compile();

    service = module.get<GuardDuttyService>(GuardDuttyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
