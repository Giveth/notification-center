import express, { Request, Response } from 'express';
import {
  authenticateThirdPartyBasicAuth,
  authenticateUser,
} from '../../middlewares/authentication';
import { NotificationsController } from '../../controllers/v1/notificationsController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();

const notificationsController = new NotificationsController();
notificationRouter.post(
  '/notifications',
  authenticateThirdPartyBasicAuth,
  async (req: Request, res: Response, next) => {
    const { microService } = res.locals;

    try {
      const result = await notificationsController.sendNotification(req.body, {
        microService,
      });
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.get(
  '/notifications',
  authenticateUser,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationsController.getNotifications(
        {
          user,
          microService,
        },
        req.query.projectId as string,
        req.query.limit as string,
        req.query.offset as string,
        req.query.isRead as string,
      );
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.put(
  '/notifications/read/:notificationId',
  authenticateUser,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationsController.readNotification(
        req.params.notificationId,
        {
          user,
          microService,
        },
      );
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);
