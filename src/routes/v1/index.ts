import express from 'express';
import { healthRouter } from './healthRouter';
import { notificationRouter } from './notificationRouter';

export const v1Router = express.Router();
v1Router.use('/v1', healthRouter);
v1Router.use('/v1', notificationRouter);
