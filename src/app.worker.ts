/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('videos', { concurrency: 2 })

/*set other options here; such as concurrency eg @Processor('queuename', {option1: 'value'})
we can also use rate limiting as one of the options here, we can specify how many jobs to run in a duration */
export class videoProcessor extends WorkerHost {
  /*
  the process method is used to process; use switch cases(on the job name) to perform different processing request
  */

  async process(job: Job) {
    //switch case to carry out different jobs
    switch (job.name) {
      case 'process':
        console.log('Starting video processing.');
        await this.processVideo(job);
        break;

      case 'compress':
        console.log('starting video compressing.');
        await this.processVideo(job);
        break;

      default:
        console.log(`Job name is not recognized: ${job.name}`);
        break;
    }
  }

  async processVideo(job: Job) {
    const totalSteps = 5;
    let step = 1;
    let progress: string | number | boolean | object;

    if (job.data.fileType !== 'mp4') {
      throw new Error(`Video file corrupted: jobId: ${job.id}`);
    }

    //use job steps; assume 3 step to process a video
    for (step; step <= totalSteps - 1; step++) {
      //simulate some kind of work being done
      await new Promise((resole) => setTimeout(resole, 3000));

      //calculate the  progress
      progress = Math.round((step / totalSteps) * 100);

      //update the job progress
      await job.updateProgress(progress);
    }
    progress = Math.round((step / totalSteps) * 100);
    await job.updateProgress(progress);
  }

  async compressVideo(job: Job) {
    let progress: string | number | boolean | object;

    if (job.data.fileType !== 'mp4') {
      throw new Error(`Video file corrupted: jobId: ${job.id}`);
    }
    let step = 1;
    progress = Math.round((step / 2) * 100);

    job.data.fileContent.replaceAll(' ', '');
    step += 1;

    progress = Math.round((step / 2) * 100);
    await job.updateProgress(progress);
  }

  /*
    event listeners are functions that are triggered when specific events occur in the queue. These events can be related to jobs, such as when a job is added, processed, completed, failed, or stalled. 
  */

  @OnWorkerEvent('active')
  onAdded(job: Job) {
    console.log(`Got a new job with id ${job.id}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Job with id: ${job.id}, ${job.progress}% completed`);
  }

  @OnWorkerEvent('completed')
  onComplete(job: Job) {
    console.log(`Completed job with id ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job with id ${job.id} failed to process`);
    console.log(`Attempt made: ${job.attemptsMade}`);
  }
}
