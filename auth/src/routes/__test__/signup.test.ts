import request from 'supertest';
import { it, expect } from '@jest/globals';

import { app } from '../../app';

// Send a post request to signup route and see if it returns 201.
it('returns a 201 on successful signup', async () => {
  // Supertest assigns random app if not specified
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 404 with invalid email', async () => {
  // Supertest assigns random app if not specified
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password'
    })
    .expect(400);
});

it('Disallows multiple emails', async () => {
  // Supertest assigns random app if not specified
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abc@def.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abc@def.com',
      password: 'password'
    })
    .expect(400);
});


// Cookies are shared only in https connection. SuperTest uses HTTP.
it('Sets a cookie after successful signup', async () => {
  // Supertest assigns random app if not specified
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@123.com',
      password: 'password'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});

