/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AppService {
  constructor(@InjectQueue('videos') private videoQueue: Queue) {}
  getHello(): string {
    return 'Hello World!';
  }

  async processVideo(fileName: string, fileType: string) {
    try {
      await this.videoQueue.add('process', {
        fileName: fileName,
        fileType: fileType,
      });
      return {
        message: 'Video processing job added to queue',
      };
    } catch (error) {
      console.log('error occurred: ', error);
      return `An error occurred: ${error.message}`;
    }
  }

  async compressVideo(fileName: string, fileType: string, fileContent: string) {
    try {
      await this.videoQueue.add('compress', {
        fileName: fileName,
        fileType: fileType,
        fileContent: fileContent,
      });
      return {
        message: 'Video compressing job added to queue',
      };
    } catch (error) {
      console.log('error occurred: ', error);
      return `An error occurred: ${error.message}`;
    }
  }
}
