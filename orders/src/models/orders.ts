import mongoose, { Mongoose } from 'mongoose';
import {OrderStatus} from '@bhticketsell/common';
import {TicketDoc} from './tickets';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface OrderAttrs {
  userId: string;
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

// Interface for describing the properties that the user model has.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Interface that describes the properties that have a user document has. Will be used in user models.
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt: {
    // Not required because paid orders shouldnt expire.
    type: mongoose.Schema.Types.Date
  },
  userId: {
    type: String,
    required: true
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket'
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
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
}


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};