import express, { Request, Response } from 'express';
import { validateAuthMicroserviceJwt } from '../../middlewares/authentication';
import { NotificationSettingsController } from '../../controllers/v1/notificationSettingsController';
import { sendStandardResponse } from '../../utils/responseUtils';

export const notificationRouter = express.Router();

const notificationSettingsController = new NotificationSettingsController();

notificationRouter.get(
  '/notification_settings',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;

    try {
      const result =
        await notificationSettingsController.getNotificationSettings(
          {
            user,
          },
          req.query.category as string,
          req.query.limit as string,
          req.query.offset as string,
        );
      return sendStandardResponse({ res, result });
    } catch (e) {
      next(e);
    }
  },
);

notificationRouter.put(
  '/notification_settings/:id',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;

    try {
      const result =
        await notificationSettingsController.updateNotificationSetting(
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
