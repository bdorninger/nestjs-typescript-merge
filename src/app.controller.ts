import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(`/merge`)
  public mergeModels(@Req() request: Request, @Body() data: any): string {
    console.log(`p`, data);
    const retval = {
      error: `Not implemented yet`,
      p: data,
    };
    return JSON.stringify(retval);
  }
}
