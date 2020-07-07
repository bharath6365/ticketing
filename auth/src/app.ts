import express from 'express';
// Do not need to call next() for errors anymore. This basically awaits throw new error calls.
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import {currentUserRouter} from './routes/current-user';
import { signinRouter} from './routes/signin'; 
import { signoutRouter} from './routes/signout';
import {signupRouter} from './routes/signup';

import {errorHandler, NotFoundError} from '@bhticketsell/common';

const app = express();

app.use(json());

// Allow INGRESS PROXY to be Secure.
app.set('trust proxy', true);

// Cookie session. Set's cookie on req.session
app.use(cookieSession({
  // Don't encrypt.
  signed: false,
  // Only HTTPS
  secure: false
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//Not found error
app.all('*', () => {
  throw new NotFoundError();
})

// Error Handler Middleware
app.use(errorHandler);

export {app};