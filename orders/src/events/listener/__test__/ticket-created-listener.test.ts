import {Message} from 'node-nats-streaming';
import {TicketCreatedEvent} from '@bhticketsell/common';
import {TicketCreatedListener} from '../ticket-created-listener';
import mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import {Ticket} from '../../../models/tickets';
import { it, expect } from '@jest/globals';
const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'Concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // Create a fake message object
  //@ts-ignore
  const msg: Message = {
    // When real ack() is called call our mock.
    ack: jest.fn(),
  }
  
  return {listener, data, msg};
}

it('Creates and Saves a Ticket', async () => {
  const {listener, data, msg} = await setup();
  
  // Call the onMessage function
  await listener.onMessage(data, msg);
  // Make assertions to check if the ticket was created.
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();

})


it('Acknowledges the message', async () => {
  // Call the onMessage function
  const {listener, data, msg} = await setup();
  
  // Call the onMessage function
  await listener.onMessage(data, msg);
  // Make assertions to check if the Ack function is called.
  expect(msg.ack).toHaveBeenCalled();
})