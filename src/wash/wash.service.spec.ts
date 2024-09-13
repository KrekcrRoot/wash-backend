import { Test, TestingModule } from '@nestjs/testing';
import { WashService } from './wash.service';

describe('WashService', () => {
  let service: WashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WashService],
    }).compile();

    service = module.get<WashService>(WashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
