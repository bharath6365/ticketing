import mongoose, { Mongoose } from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  owner: string;
  description: string;
}

// Interface for describing the properties that the user model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Interface that describes the properties that have a ticket document has. Will be used in ticket models.
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  owner: string;
  orderId?: string;
  description: string;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
  }
  },{
    // Created At date for all the tickets.
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret) {
        // For consistent payload. We replace _id with id.
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
)

// Add Plugins.
// Use version of __v
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Type checking. Only way to create a new ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};