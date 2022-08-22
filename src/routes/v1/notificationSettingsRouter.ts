import express, { Request, Response } from 'express';
import {
  authenticateThirdPartyBasicAuth,
  authenticateUser,
} from '../../middlewares/authentication';
import { NotificationSettingsController } from '../../controllers/v1/notificationSettingsController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();

const notificationController = new NotificationSettingsController();
notificationRouter.put(
  '/notification_settings/:id',
  authenticateThirdPartyBasicAuth,
  async (req: Request, res: Response, next) => {
    const { microService } = res.locals;

    try {
      const result = await notificationController.updateNotificationSetting(req.body, {
        microService,
      });
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.get(
  '/notification_settings',
  authenticateUser,
  async (req: Request, res: Response, next) => {
    const { microService, user } = res.locals;

    try {
      const result = await notificationController.getNotificationSettings(
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
