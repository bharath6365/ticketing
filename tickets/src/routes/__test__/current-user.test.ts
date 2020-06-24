import request from 'supertest';
import { it, expect } from '@jest/globals';

import { app } from '../../app';

// Send a post request to signup route and see if it returns 201.
it('Sends details about the current user who is logged in.', async () => {
  // Supertest assigns random app if not specified
  const cookie = await global.signin();
  const response = await await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
