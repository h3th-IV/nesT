import { Controller, Get, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/process')
  async processVideo(@Body() body: { fileName: string; fileType: string }) {
    const message = await this.appService.processVideo(
      body.fileName,
      body.fileType,
    );
    return message;
  }

  @Post('/compress')
  async compressVideo(
    @Body() body: { fileName: string; fileType: string; fileContent: string },
  ) {
    const message = await this.appService.compressVideo(
      body.fileName,
      body.fileType,
      body.fileContent,
    );
    return message;
  }
}
