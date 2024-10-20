import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redeem')
  redeem(@Query() query: { nftId: string }): Promise<string> {
    console.log(query.nftId);
    return this.appService.redeem(query.nftId);
  }
}
