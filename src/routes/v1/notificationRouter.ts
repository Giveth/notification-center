import express, { Request, Response } from 'express';
import { validateAuthMicroserviceJwt } from '../../middlewares/authentication';
import { NotificationsController } from '../../controllers/v1/notificationsController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();

const notificationsController = new NotificationsController();
notificationRouter.post(
  '/notifications',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationsController.sendNotification(req.body, {
        user,
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
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationsController.getNotifications(
        {
          user,
        },
        req.query.category as string,
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
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;

    try {
      const result = await notificationsController.readNotification(
        req.params.notificationId,
        {
          user,
        },
      );
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.get(
  '/notifications/countUnread',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationsController.countUnreadNotifications({
        user,
      });
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.put(
  '/notifications/readAll',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;
    const category = req.body.category;

    try {
      const result = await notificationsController.readAllUnreadNotifications({
        user,
        category,
      });
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);
