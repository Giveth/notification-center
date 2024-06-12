import express, { Request, Response } from 'express';
import { validateAuthMicroserviceJwt } from '../../middlewares/authentication';
import { NotificationSettingsController } from '../../controllers/v1/notificationSettingsController';
import { sendStandardResponse } from '../../utils/responseUtils';
import { logger } from '../../utils/logger';

export const notificationSettingsRouter = express.Router();

const notificationSettingsController = new NotificationSettingsController();

notificationSettingsRouter.get(
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
      logger.error('get /notification_settings error', e);
      next(e);
    }
  },
);

notificationSettingsRouter.put(
  '/notification_settings/:id',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;
    console.log('user' + user);

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
      logger.error('/notification_settings/:id error', e);
      next(e);
    }
  },
);

notificationSettingsRouter.put(
  '/notification_settings',
  validateAuthMicroserviceJwt,
  async (req: Request, res: Response, next) => {
    const { user } = res.locals;

    try {
      const result =
        await notificationSettingsController.updateNotificationSettings(
          req.body,
          {
            user,
          },
        );
      return sendStandardResponse({ res, result });
    } catch (e) {
      logger.error('put /notification_settings error', e);
      next(e);
    }
  },
);
