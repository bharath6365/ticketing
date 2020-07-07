import mongoose from 'mongoose';
import {app} from './app';
import {natsWrapper} from './nats-wrapper';
import { OrderCreatedListener } from './events/listener/order-created-listener';
import { OrderCancelledListener } from './events/listener/order-cancelled-listener';


const startApp = async () => {
  console.log('Starting...');
  // JWT Secret
  if (!process.env.JWT_KEY) {
    throw new Error('JWT Secret does not exist');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined');
  }
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
    
    // Listening for Events.
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();    

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch(e) {
    console.log('Error', e);
  }

  app.listen('3000', () => {
    console.log('Auth Service listening on port 3000');
  });
}

startApp();

