/* eslint-disable prettier/prettier */
import {  Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log("controller interface");
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
