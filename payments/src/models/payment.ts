import mongoose, { Mongoose } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface attributes for adding a new payment. Remember this is not the schema of the entire doc.
interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

// Interface for describing the properties that the payment model has.
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

// Interface that describes the properties that have a payment document has. Will be used in user models. We don't need a version because payments are never updated.
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
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

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

// Type checking. Only way to create a new ticket
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId
  });
}


const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export {Payment};