import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, beforeEach, afterAll } from '@jest/globals'
import jwt from 'jsonwebtoken';


import {app} from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

// Before all the tests are executed
let mongo: any;
beforeAll(async () => {
  // Our app expects this.
  process.env.JWT_KEY = 'abcd';
  mongo = new MongoMemoryServer();

  const mongoURI = await mongo.getUri();

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
})

// Before each test. We will reset the data.
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  
  // Before every individual test. Delete every collection.
  for (let collection of collections) {
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

global.signin = () => {
  // Build a JWT Payload.
  const user = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'x@x.com'
  }


  // Create a JWT web token.
 const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY || ''
    );

  // Build the cookie.
  const session = {jwt: userJWT}

  // Turn that session to json
  const sessionJSON = JSON.stringify(session);

  // Take session and encode it as base64.
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //Return a string that's a cookie.
  return [`express:sess=${base64}`];

}