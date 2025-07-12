import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { videoProcessor } from './app.worker';
import { VideoQueueEventListener } from './app.queue.events';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 3000,
        backoff: 2000, //after every failure wait two seconds before retry, if concurrency quota isn't full
      },
    }),
    BullModule.registerQueue({
      name: 'videos',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, videoProcessor, VideoQueueEventListener],
})
export class AppModule {}
