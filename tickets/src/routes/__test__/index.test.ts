import request from 'supertest';
import { it, expect } from '@jest/globals';
import mongoose from 'mongoose';

import { app } from '../../app';

it('Can fetch a list of tickets', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Xyz',
    price: 10
  })

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Def',
    price: 20
  })

  const response = await request(app)
  .get('/api/tickets')
  .send()
  .expect(200)

  expect(response.body.length).toEqual(2);
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


