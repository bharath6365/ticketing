import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';
console.clear();


// Means client.
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to nats');

  stan.on('close',  () => {
    console.log('NATS Conection closed');
    process.exit();
  })
 

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: '1',
    title: 'Abc',
    price: 20
  })
})

process.on('SIGINT',() => stan.close());
process.on('SIGTERM',() => stan.close());
