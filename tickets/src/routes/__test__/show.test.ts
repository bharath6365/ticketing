import request from 'supertest';
import { it, expect } from '@jest/globals';
import mongoose from 'mongoose';

import { app } from '../../app';

it('Returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).get(`/api/tickets/${id}`).send();

  expect(response.status).toEqual(404);
});

it('Returns a ticket if ticket is found', async () => {
  const title = 'Xyz';
  const price = 10;
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price
  });

  expect(response.status).toEqual(201);

  const ticketCreationResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200);

  expect(ticketCreationResponse.body.title).toEqual(title);
  expect(ticketCreationResponse.body.price).toEqual(price);
});

it('Should not return 401 if user is authenticated', async () => {
  // Attach the cookie.

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({});

  expect(response.status).not.toEqual(401);
});

it('Returns error if invalid title is provided', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: '',
    price: 10
  });

  expect(response.status).toEqual(400);
});
