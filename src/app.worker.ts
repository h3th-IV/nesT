import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { resolve } from 'path';

@Processor('videos')
export class videoProcessor extends WorkerHost {
  async process(job: Job) {
    //Process 'em videos
    console.log(`Got a new job: ${job.id}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Completed Job ${job.id}.`);
  }
}
