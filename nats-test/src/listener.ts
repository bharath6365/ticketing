import nats, {Message, Stan } from 'node-nats-streaming';
import TicketCreatedListener from './events/ticket-created-listener';

console.clear();

// Means client.
const stan = nats.connect('ticketing', '123', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  new TicketCreatedListener(stan).listen();
})

