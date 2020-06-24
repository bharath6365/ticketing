import request from 'supertest';
import { it, expect } from '@jest/globals';

import { app } from '../../app';

// Send a post request to signup route and see if it returns 201.
it('Clears the cookie after signing out', async () => {
  // Supertest assigns random app if not specified
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password'
    })
    .expect(201);

  const response = await request(app).post('/api/users/signout').send({}).expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
