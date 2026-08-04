import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Heo World!';
  }
  saybye(): string {
    return 'Goodbye World!';
  }   
  rich(): string {
    return 'Rich World!';
  }
}
