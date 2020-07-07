import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, beforeEach, afterAll } from '@jest/globals'
import request from 'supertest';


import {app} from '../app';
jest.setTimeout(30000);



declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
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

global.signin = async() => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
  .post("/api/users/signup")
  .send({email, password})
  .expect(201)

  const cookie = response.get('Set-Cookie');

  return cookie;
}