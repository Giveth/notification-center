import { Route, Tags, Body, Security, Inject, Get, Query, Put } from 'tsoa';
import { logger } from '../../utils/logger';
import {
  findNotificationSettingById,
  getUserNotificationSettings,
  updateUserNotificationSetting,
} from '../../repositories/notificationSettingRepository';
import { UserAddress } from '../../entities/userAddress';
import { errorMessages } from '../../utils/errorMessages';
import {
  updateNotificationSettings,
  updateOneNotificationSetting,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import { StandardError } from '../../types/StandardError';

interface SettingParams {
  id: number;
  allowEmailNotification: boolean;
  allowDappPushNotification: boolean;
}

@Route('/v1/notification_settings')
@Tags('NotificationSettings')
export class NotificationSettingsController {
  @Put('/')
  @Security('JWT')
  public async updateNotificationSettings(
    @Body()
    body: {
      settings: SettingParams[];
    },
    @Inject()
    params: {
      user: UserAddress;
    },
  ) {
    const { user } = params;
    const { settings } = body;

    try {
      validateWithJoiSchema(body, updateNotificationSettings);

      const updatedNotifications = await Promise.all(
        settings.map(async setting => {
          const { id, allowEmailNotification, allowDappPushNotification } =
            setting;

          const updatedNotification = await updateUserNotificationSetting({
            notificationSettingId: id,
            userAddressId: user.id,
            allowEmailNotification,
            allowDappPushNotification,
          });

          return updatedNotification;
        }),
      );

      return updatedNotifications;
    } catch (e) {
      logger.error('updateNotificationSetting() error', e);
      throw e;
    }
  }

  @Put('/:id')
  @Security('JWT')
  public async updateNotificationSetting(
    @Body()
    body: {
      id: number;
      allowEmailNotification: boolean;
      allowDappPushNotification: boolean;
    },
    @Inject()
    params: {
      user: UserAddress;
    },
  ) {
    const { user } = params;
    const { id, allowEmailNotification, allowDappPushNotification } = body;
    try {
      validateWithJoiSchema(body, updateOneNotificationSetting);

      const notificationSetting = await findNotificationSettingById(id);

      if (!notificationSetting) {
        throw new StandardError({
          message: errorMessages.NOTIFICATION_SETTING_NOT_FOUND,
          httpStatusCode: 400,
        });
      }
      const newSettingData = {
        notificationSettingId: id,
        userAddressId: user.id,
        allowEmailNotification,
        allowDappPushNotification,
      };
      return await updateUserNotificationSetting(newSettingData);
    } catch (e) {
      logger.error('updateNotificationSetting() error', e);
      throw e;
    }
  }

  // https://tsoa-community.github.io/docs/examples.html#parameter-examples
  /**
   * @example category "1"
   * @example limit "20"
   * @example offset "0"
   */
  @Get('/')
  @Security('JWT')
  public async getNotificationSettings(
    @Inject()
    params: {
      user: UserAddress;
    },
    @Query('category') category?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const { user } = params;
    try {
      const take = limit ? Number(limit) : 20;
      const skip = offset ? Number(offset) : 0;
      const [notificationSettings, count] = await getUserNotificationSettings(
        take,
        skip,
        user.id,
        category,
      );

      return {
        notificationSettings,
        count,
      };
    } catch (e) {
      logger.error('getNotificationSettings() error', e);
      throw e;
    }
  }
}
