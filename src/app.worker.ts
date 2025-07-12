import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('videos', { concurrency: 5 }) //set other options here; such as concurrency eg @Processor('queuename', {option1: 'value'})
export class videoProcessor extends WorkerHost {
  async process(job: Job) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const video = job.data;
    if (video.fileType !== 'mp4') {
      throw new Error(`Video file corrupted: jobId:: ${job.id}`);
    }
    return 'Job processed successfully';
  }

  /*
    event listeners are functions that are triggered when specific events occur in the queue. These events can be related to jobs, such as when a job is added, processed, completed, failed, or stalled. 
  */

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log(`Got a new job with id ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onComplete(job: Job) {
    console.log(`Completed job with id ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job with id ${job.id} failed to process`);
  }
}
