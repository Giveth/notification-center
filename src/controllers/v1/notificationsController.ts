import {
  Route,
  Tags,
  Post,
  Body,
  Security,
  Inject,
  Get,
  Query,
  Put,
  Path,
  Example,
} from 'tsoa';
import { logger } from '../../utils/logger';

import {
  getNotificationsValidator,
  readSingleNotificationsValidator,
  sendNotificationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {
  CountUnreadNotificationsResponse,
  GetNotificationsResponse,
  ReadAllNotificationsResponse,
  ReadSingleNotificationResponse,
  SendNotificationRequest,
  SendNotificationResponse,
  SendNotificationTypeRequest,
} from '../../types/requestResponses';
import { errorMessages, errorMessagesEnum } from '../../utils/errorMessages';
import { StandardError } from '../../types/StandardError';
import { User } from '../../types/general';
import {
  countUnreadNotifications,
  getNotifications,
  markNotificationGroupAsRead,
  markNotificationsAsRead,
} from '../../repositories/notificationRepository';
import { UserAddress } from '../../entities/userAddress';
import { getNotificationTypeByEventName } from '../../repositories/notificationTypeRepository';
import { SCHEMA_VALIDATORS } from '../../utils/validators/segmentValidators';

@Route('/v1/notifications')
@Tags('Notification')
export class NotificationsController {
  @Post('/')
  public async sendNotification(
    @Body()
    body: SendNotificationTypeRequest,
    @Inject()
    params: {
      // flag for sending email or just save in front
      user: UserAddress;
      microService: string;
    },
  ): Promise<SendNotificationResponse> {
    const { microService } = params;
    try {
      const notificationType = await getNotificationTypeByEventName(body.eventName);

      if (!notificationType) throw new Error(errorMessages.INVALID_NOTIFICATION_TYPE);

      const schemaValidator = SCHEMA_VALIDATORS[notificationType.schemaValidator as string];

      validateWithJoiSchema(body.data, schemaValidator);
      // TODO insert notification in DB
      // TODO send segment event, email , ...
      // TODO update notification record
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('sendNotification() error', e);
      throw e;
    }
  }

  // https://tsoa-community.github.io/docs/examples.html#parameter-examples
  /**
   * @example projectId "1"
   * @example limit "20"
   * @example offset "0"
   * @example isRead "true"
   * @example isRead "false"
   */
  @Get('/')
  public async getNotifications(
    @Inject()
    params: {
      user: UserAddress;
    },
    @Query('category') category?: string,
    @Query('projectId') projectId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('isRead') isRead?: string,
  ): Promise<GetNotificationsResponse> {
    const { user } = params;
    const take = limit ? Number(limit) : 10;
    const skip = offset ? Number(offset) : 0;

    try {
      const [notifications, count] = await getNotifications(
        user.id,
        category,
        projectId,
        take,
        skip,
        isRead,
      );
      return {
        notifications,
        count,
      };
    } catch (e) {
      logger.error('getNotifications() error', e);
      throw e;
    }
  }

  @Get('/countUnread')
  @Security('JWT')
  public async countUnreadNotifications(
    @Inject()
    params: {
      user: UserAddress;
    },
  ): Promise<CountUnreadNotificationsResponse> {
    const { user } = params;
    try {
      const notificationCounts = await countUnreadNotifications(user);
      return notificationCounts;
    } catch (e) {
      logger.error('getNotifications() error', e);
      throw e;
    }
  }

  /**
   *
   */
  @Put('/read/:notificationId')
  public async readNotification(
    @Path() notificationId: string,
    @Inject()
    params: {
      user: UserAddress;
    },
  ): Promise<ReadSingleNotificationResponse> {
    try {
      const user = params.user;
      const notification = await markNotificationsAsRead(
        [Number(notificationId)],
        user.id,
      );
      return {
        notification: notification.raw[0],
      };
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }

  @Put('/readAll')
  public async readAllUnreadNotifications(
    @Inject()
    params: {
      user: UserAddress;
      category?: string;
    },
  ): Promise<CountUnreadNotificationsResponse> {
    const user = params.user;

    try {
      // in case mark as read all is limited per category
      await markNotificationGroupAsRead(user, params.category);
      const notificationCounts = await countUnreadNotifications(user);

      return notificationCounts;
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }
}
