import express, { Request, Response } from 'express';
import { authenticateThirdPartyBasicAuth } from '../../middlewares/authentication';
import { NotificationController } from '../../controllers/v1/notificationController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();
const notificationController = new NotificationController();
notificationRouter.post(
  '/notifications',
  authenticateThirdPartyBasicAuth,
  async (req: Request, res: Response, next) => {
    const { microService } = res.locals;

    try {
      const result = await notificationController.sendNotification(
        req.body,
        {
            microService,
        },
      );
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);
