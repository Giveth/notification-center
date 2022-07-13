import express, { Request, Response } from 'express';
import { HealthController } from '../../controllers/v1/healthController';

export const healthRouter = express.Router();
healthRouter.get('/health', async (_req: Request, res: Response) => {
  const controller = new HealthController();
  const response = await controller.getMessage();
  return res.send(response);
});
