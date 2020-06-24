import request from 'supertest';
import { it, expect } from '@jest/globals';

import { app } from '../../app';

it('Has a route handler listening to /api/tickets POST Request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('Should return 401 if user is not authenticated', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).toEqual(401);
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

it('Returns error if invalid price is provided', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Abc',
    price: -10
  });

  expect(response.status).toEqual(400);

});

it('Creates a ticket with valid inputs', async () => {
  // Make sure database record was created.
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'Abc',
    price: '10'
  });

  expect(response.status).toEqual(201);
});
