import { Test, TestingModule } from '@nestjs/testing';
import { ResturantController } from './resturant.controller';
import { ResturantService } from './resturant.service';

describe('ResturantController', () => {
  let controller: ResturantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResturantController],
      providers: [ResturantService],
    }).compile();

    controller = module.get<ResturantController>(ResturantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
