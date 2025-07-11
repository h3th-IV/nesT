import { Controller, Get, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  async uploadVideo(@Body() body: { fileName: string; fileType: string }) {
    const message = await this.appService.addVideoToQueue(
      body.fileName,
      body.fileType,
    );
    return message;
  }
}
