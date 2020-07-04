import { natsWrapper } from '../nats-wrapper';
import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publisher/expiration-complete-publisher';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>(
  // Bucket inside redis server.
  'order:expiration',
  {
    redis: {
      host: process.env.REDIS_HOST
    }
  }
)

expirationQueue.process(async (job) => {
  // Job wraps us the entire information.
  console.log('I want to publish an expiration complete event for', job.data.orderId);

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export {expirationQueue};