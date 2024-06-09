import express, { Request, Response } from 'express';
import {
  authenticateThirdPartyServiceToken,
  validateAuthMicroserviceJwt,
} from '../../middlewares/authentication';
import { NotificationsController } from '../../controllers/v1/notificationsController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();

const notificationsController = new NotificationsController();
notificationRouter.post(
  '/thirdParty/notifications',
  authenticateThirdPartyServiceToken,
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

notificationRouter.post(
  '/thirdParty/notificationsBulk',
  authenticateThirdPartyServiceToken,
  async (req: Request, res: Response, next) => {
    const { microService } = res.locals;
    try {
      const result = await notificationsController.sendBulkNotification(
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

notificationRouter.get(
  '/notifications',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;
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
  '/notifications/countUnread/:walletAddress',
  async (req: Request, res: Response, next) => {
    const walletAddress = req.params.walletAddress as string;
    try {
      const result =
        await notificationsController.countUnreadNotifications(walletAddress);
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

    try {
      const result = await notificationsController.readAllUnreadNotifications(
        req.body,
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
