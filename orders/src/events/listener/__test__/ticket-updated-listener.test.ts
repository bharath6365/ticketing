import {Message} from 'node-nats-streaming';
import {TicketUpdatedEvent} from '@bhticketsell/common';
import {TicketUpdatedListener} from '../ticket-updated-listener';
import mongoose from 'mongoose';
import {natsWrapper} from '../../../nats-wrapper';
import { it, expect } from '@jest/globals';
import {Ticket} from '../../../models/tickets';
const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a fake Ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20
  })
  // Save the ticket to the DB.
  await ticket.save();
  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: 1,
    title: 'New Concert',
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // Create a fake message object
  //@ts-ignore
  const msg: Message = {
    // When real ack() is called call our mock.
    ack: jest.fn(),
  }
  
  return {listener, data, msg, ticket};
}

it('find, updates and save a ticket', async () => {
  const {listener, data, msg, ticket} = await setup();
  
  // Call the onMessage function
  await listener.onMessage(data, msg);
  // Make assertions to check if the ticket was created.
  // Refetch our ticket from the collection.
  const updatedTicket = await Ticket.findById(ticket.id);


  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);

})

it('Acknowledges the message', async () => {
  // Call the onMessage function
  const {listener, data, msg} = await setup();
  
  // Call the onMessage function
  await listener.onMessage(data, msg);
  // Make assertions to check if the Ack function is called.
  expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if event has a skipped version number', async () => {
  const {listener, data, msg} = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch {

  }
  
  expect(msg.ack).not.toHaveBeenCalled();

})