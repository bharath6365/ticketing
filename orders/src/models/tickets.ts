import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose, { Mongoose, version } from 'mongoose';
import {Order} from './orders';

import {OrderStatus} from '@bhticketsell/common';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface TicketAttrs {
  id: string
  title: string;
  price: number;
  userId: string;
}

// Interface for describing the properties that the user model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>
}

// Interface that describes the properties that have a user document has. Will be used in user models.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  isReserved(): Promise<boolean>;
  version: number;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 
  },
  userId: {
    type: String,
    required: true
  },
  },{
    toJSON: {
      transform(doc, ret) {
        // For consistent payload. We replace _id with id.
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
)

// Versioning
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Type checking. Only way to create a new ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    userId: attrs.userId
  });
}

ticketSchema.statics.findByEvent = (event: {id: string,version: number }) => {
  return Ticket.findOne({_id: event.id, version: event.version - 1})
}

/* Make sure that the ticket is not already not reserved by someone else.
  Run query to look at all orders and find an order is the ticket we just fetched above
  and order status is not cancelled.
 */
ticketSchema.methods.isReserved = async function() {
  // this is the ticket document that we called isReserved on.
  const existingOrder = await Order.findOne({
      ticket: this,
      status: {$in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment
      ]}
    })

    return !!existingOrder;
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};