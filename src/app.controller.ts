import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('bye') 
  saybye(): string {
    return this.appService.saybye();
  }
  @Get('rich')
  rich(): string {
    return this.appService.rich();
  }
}
