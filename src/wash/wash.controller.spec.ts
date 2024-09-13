import { Test, TestingModule } from '@nestjs/testing';
import { WashController } from './wash.controller';

describe('WashController', () => {
  let controller: WashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WashController],
    }).compile();

    controller = module.get<WashController>(WashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
