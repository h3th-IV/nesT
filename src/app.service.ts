import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AppService {
  constructor(@InjectQueue('videos') private videoQueue: Queue) {}
  getHello(): string {
    return 'Hello World!';
  }

  async addVideoToQueue(fileName: string, fileType: string) {
    await this.videoQueue.add('videoProcess', {
      fileName: fileName,
      fileType: fileType,
    });

    return {
      message: 'Video processing job added to queue',
    };
  }
}
