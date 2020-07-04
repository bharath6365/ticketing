
import {natsWrapper} from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';

const startApp = async () => {
  if (!process.env.NATS_URL) {
    throw new Error('Nats URL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Nats Client ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Nats Cluster ID must be defined');
  }
  
  // Connect to mongoose. First argument is the name of the nats-cluster-ip definded in deployment config.
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('Nats Client Closing');
      process.exit(0);
    })
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();

  } catch(e) {
    console.log('Error', e);
  }

}

startApp();

