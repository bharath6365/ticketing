import mongoose, { Mongoose } from 'mongoose';
import {OrderStatus} from '@bhticketsell/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus
  price: number
}

// Interface for describing the properties that the user model has.
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// Interface that describes the properties that have a user document has. Will be used in user models.
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus
  price: number
  version: number
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  price: {
    // Not required because paid orders shouldnt expire.
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

// Type checking. Only way to create a new ticket
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    status: attrs.status,
    userId: attrs.userId
  });
}


const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};