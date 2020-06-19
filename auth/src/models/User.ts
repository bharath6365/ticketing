import mongoose, { Mongoose } from 'mongoose';
import Password from '../services/password';

// Interface attributes for adding a new user.
interface UserAttrs {
  email: string;
  password: string;
}

// Interface for describing the properties that the user model has.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the properties that have a user document has. Will be used in user models.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, 
  },{
    toJSON: {
      transform(doc, ret) {
        // For consistent payload.
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
)

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

// Pre Save Hooks. Need function keyword for document reference.
userSchema.pre('save', async function(done) {
  // Modify the password only if the password field was changed in the user document. We don't wanna change the password if username is updated.
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));

    this.set('password', hashedPassword);
  }
  
  // Need to call done finally so that document can be saved.
  done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};