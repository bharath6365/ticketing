import mongoose from 'mongoose';
import {app} from './app';

const startApp = async () => {
  // JWT Secret
  if (!process.env.JWT_KEY) {
    throw new Error('JWT Secret does not exist');
  }
  // Connect to mongoose
  try {
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch(e) {
    console.log('Error', e);
  }

  app.listen('3000', () => {
    console.log('Auth Service listening on port 3000');
  });
}

startApp();

