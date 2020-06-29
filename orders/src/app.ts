import express from 'express';
// Do not need to call next() for errors anymore. This basically awaits throw new error calls.
import 'express-async-errors';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import {errorHandler, NotFoundError, currentUser} from '@bhticketsell/common';
import { createOrderRouter } from './routes/new-order';
import { showOrderRouter } from './routes/show-order';
import { deleteOrderRouter } from './routes/delete-order';
import { showAllOrdersRouter } from './routes/show-all-orders';

const app = express();

app.use(json());

// Allow INGRESS PROXY to be Secure.
app.set('trust proxy', true);

// Cookie session. Set's cookie on req.session
app.use(cookieSession({
  // Don't encrypt.
  signed: false,
  // Only HTTPS
  secure: process.env.NODE_ENV !== 'test'
}))

// Middleware for Auth.
app.use(currentUser);

// Routes.
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(showAllOrdersRouter);

//Not found error
app.all('*', () => {
  throw new NotFoundError();
})

// Error Handler Middleware
app.use(errorHandler);

export {app};