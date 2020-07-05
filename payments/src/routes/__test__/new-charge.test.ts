import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import {OrderStatus} from '@bhticketsell/common';
import { it, expect } from '@jest/globals';
import {natsWrapper} from '../../nats-wrapper';
// This will import the mock file.
import {stripe} from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId, token: '213141' })
    .expect(404);
});

it('returns a 404 for an order that does not belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: '2141',
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ orderId: order.id, token: '213141' })
    .expect(401);

});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Canceled
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: '213141' })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);
    
    // Get the arguments out of the mock call.
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // This will give currency
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 10);
    expect(chargeOptions.currency).toEqual('inr');

    // Find one payment with the given order id.
    const payment = await Payment.findOne({
      orderId: order.id,
    })

    expect(payment).not.toBeNull();
  });
