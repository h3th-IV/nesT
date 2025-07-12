import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

//queue event listeners are used to listen to event on the queue, e.g whena job enters the active state

@QueueEventsListener('videos')
export class VideoQueueEventListener extends QueueEventsHost {
  logger = new Logger('Queue');

  @OnQueueEvent('added')
  onAddedNewJob(job: { jobId: string; name: string }) {
    this.logger.log(`Job ${job.jobId} has been added to the queue`);
  }
}
