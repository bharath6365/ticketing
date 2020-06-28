import request from 'supertest';
import { it, expect } from '@jest/globals';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

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

it('Should return 400 if title/price is invalid', async () => {
  const cookie = global.signin();
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'Xyz',
    price: 20
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 200
  })

  expect(updateResponse.status).toEqual(400);
});

it('Updates the ticket gives a 200 response', async () => {
  const cookie = global.signin();
  const response = await request(app)
  .post(`/api/tickets`)
  .set('Cookie', cookie)
  .send({
    title: 'Xyz',
    price: 20
  });

  const updateResponse = await request(app).put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'Xyz',
    price: 200
  })

  expect(updateResponse.status).toEqual(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

