import mongoose, { Mongoose } from 'mongoose';
import {Order} from './orders';

import {OrderStatus} from '@bhticketsell/common';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface TicketAttrs {
  title: string;
  price: number;
}

// Interface for describing the properties that the user model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Interface that describes the properties that have a user document has. Will be used in user models.
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
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
  } 
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

// Type checking. Only way to create a new ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
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