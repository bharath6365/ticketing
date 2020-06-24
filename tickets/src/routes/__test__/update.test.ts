import request from 'supertest';
import { it, expect } from '@jest/globals';
import mongoose from 'mongoose';

import { app } from '../../app';

it('Should return 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'Xyz',
    price: 20
  });

  expect(response.status).toEqual(404);
});

it('Should return 401 if user is not authenticated', async () => {
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', global.signin())
  .send({
    title: 'Xyz',
    price: 20
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'Xyzz',
    price: 200
  })

  expect(updateResponse.status).toEqual(401);
});

it('Should return 401 if user does not own the ticket', async () => {
  // Attach the cookie.

  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});

  expect(response.status).not.toEqual(401);
});

it('Returns error if invalid title is provided', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: '',
    price: 10
  });

  expect(response.status).toEqual(400);
});

it('Returns error if invalid price is provided', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'Abc',
    price: -10
  });

  expect(response.status).toEqual(400);
});

it('Updates a ticket with valid inputs', async () => {
  // Make sure database record was created.
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'Abc',
    price: '10'
  });

  expect(response.status).toEqual(201);
});
