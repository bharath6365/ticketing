import mongoose, { Mongoose } from 'mongoose';

// Interface attributes for adding a new user. Remember this is not the schema of the entire doc.
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Interface for describing the properties that the user model has.
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Interface that describes the properties that have a user document has. Will be used in user models.
interface TicketDoc extends mongoose.Document {
  email: string;
  password: string;
  userId: string;
}

const ticketSchema = new mongoose.Schema({
  title: {
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
  } 
  },{
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

// Type checking. Only way to create a new ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};