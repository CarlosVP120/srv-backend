import { Test, TestingModule } from '@nestjs/testing';
import { MsSecurityController } from './ms-security.controller';
import { MsSecurityService } from './ms-security.service';

describe('MsSecurityController', () => {
  let msSecurityController: MsSecurityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MsSecurityController],
      providers: [MsSecurityService],
    }).compile();

    msSecurityController = app.get<MsSecurityController>(MsSecurityController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(msSecurityController.getHello()).toBe('Hello World!');
    });
  });
});
