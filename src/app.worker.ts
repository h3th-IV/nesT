import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('videos', { concurrency: 5 }) //set other options here; such as concurrency eg @Processor('queuename', {option1: 'value'})
//we can also use rate limiting as one of the options here, we can specify how many jobs to run in a duration
export class videoProcessor extends WorkerHost {
  async process(job: Job) {
    //use job steps; assume 3 step to process a video
    const jobSteps = 5;
    let step = 1;
    let progress;
    for (step; step <= jobSteps - 1; step++) {
      //simulate some kind of work being done
      await new Promise((resole) => setTimeout(resole, 3000));

      //calc progress
      progress = Math.round((step / jobSteps) * 100);

      //update the job progress
      await job.updateProgress(progress);
    }
    const video = job.data;
    if (video.fileType !== 'mp4') {
      throw new Error(`Video file corrupted: jobId: ${job.id}`);
    }
    console.log('steps in for: ', step);
    progress = Math.round((step / jobSteps) * 100);
    await job.updateProgress(progress);
    
    return 'Job processed successfully';
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
