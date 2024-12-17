import { Injectable } from '@nestjs/common';

@Injectable()
export class MsSecurityService {
  getHello(): string {
    return 'Hello World!';
  }
}
