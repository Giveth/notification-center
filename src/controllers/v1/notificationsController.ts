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
} from 'tsoa';
import { logger } from '../../utils/logger';

import {
  countUnreadValidator,
  sendBulkNotificationValidator,
  sendNotificationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {
  CountUnreadNotificationsResponse,
  GetNotificationsResponse,
  ReadAllNotificationsRequestType,
  ReadSingleNotificationResponse,
  SendNotificationResponse,
  SendNotificationRequest,
  sendBulkNotificationRequest,
} from '../../types/requestResponses';
import { errorMessages } from '../../utils/errorMessages';
import {
  countUnreadNotifications,
  getNotifications,
  markNotificationGroupAsRead,
  markNotificationsAsRead,
} from '../../repositories/notificationRepository';
import { UserAddress } from '../../entities/userAddress';
import { Notification } from '../../entities/notification';
import { createNewUserAddressIfNotExists } from '../../repositories/userAddressRepository';
import { sendNotification } from '../../services/notificationService';
import { StandardError } from '../../types/StandardError';

@Route('/v1')
@Tags('Notification')
export class NotificationsController {
  @Post('/thirdParty/notifications')
  @Security('basicAuth')
  public async sendNotification(
    @Body()
    body: SendNotificationRequest,
    @Inject()
    params: {
      microService: string;
    },
  ): Promise<SendNotificationResponse> {
    const { microService } = params;
    try {
      validateWithJoiSchema(body, sendNotificationValidator);
      return sendNotification(body, microService);
      // add if and logic for push notification (not in mvp)
    } catch (e) {
      logger.error('sendNotification() error', {
        error: e,
        requestBody: body,
        segmentPayload: body?.segment?.payload,
      });
      throw e;
    }
  }

  @Post('/thirdParty/notificationsBulk')
  @Security('basicAuth')
  public async sendBulkNotification(
    @Body()
    body: sendBulkNotificationRequest,
    @Inject()
    params: {
      microService: string;
    },
  ): Promise<SendNotificationResponse> {
    const { microService } = params;
    try {
      validateWithJoiSchema(body, sendBulkNotificationValidator);
      await Promise.all(
        body.notifications.map(item => sendNotification(item, microService)),
      );
      return { success: true };
    } catch (e) {
      logger.error('sendBulkNotification() error', {
        error: e,
      });
      throw e;
    }
  }

  // https://tsoa-community.github.io/docs/examples.html#parameter-examples
  /**
     * @example limit "20"
     * @example offset "0"
     * @example category ""
     * @example category "projectRelated"
     * @example category "givEconomyRelated"
     * @example category "general"
     * @example isRead ""
     * @example isRead "false"
     * @example isRead "true"
     * @example startTime "1659356987"

     */
  @Get('/notifications/')
  @Security('JWT')
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
    @Query('startTime') startTime?: number,
  ): Promise<GetNotificationsResponse> {
    const { user } = params;
    const take = limit ? Number(limit) : 10;
    const skip = offset ? Number(offset) : 0;

    try {
      const [notifications, count] = await getNotifications({
        userAddressId: user.id,
        category,
        projectId,
        limit: take,
        skip,
        isRead,
        startTime,
      });
      return {
        count,
        notifications,
      };
    } catch (e) {
      logger.error('getNotifications() error', e);
      throw e;
    }
  }

  /**
   * @example walletAddress "0xcebd435a44f1f4bf952c5a543e82e51deb2b0bb6"
   */
  @Get('/notifications/countUnread/:walletAddress')
  public async countUnreadNotifications(
    @Path('walletAddress') walletAddress: string,
  ): Promise<CountUnreadNotificationsResponse> {
    try {
      validateWithJoiSchema({ walletAddress }, countUnreadValidator);
      const user = await createNewUserAddressIfNotExists(
        walletAddress.toLowerCase(),
      );

      return countUnreadNotifications(user);
    } catch (e) {
      logger.error('countUnreadNotifications() error', e);
      throw e;
    }
  }

  /**
   *
   */
  @Put('/notifications/read/:notificationId')
  @Security('JWT')
  public async readNotification(
    @Path() notificationId: string,
    @Inject()
    params: {
      user: UserAddress;
    },
  ): Promise<ReadSingleNotificationResponse> {
    try {
      const user = params.user;
      const notification = await markNotificationsAsRead({
        notificationId: Number(notificationId),
        userAddressId: user.id,
      });
      if (!notification) {
        throw new StandardError({
          message: errorMessages.NOTIFICATION_NOT_FOUND,
          httpStatusCode: 404,
        });
      }
      return {
        notification,
      };
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }

  @Put('/notifications/readAll')
  @Security('JWT')
  public async readAllUnreadNotifications(
    @Body()
    body: ReadAllNotificationsRequestType,
    @Inject()
    params: {
      user: UserAddress;
    },
  ): Promise<CountUnreadNotificationsResponse> {
    const user = params.user;

    try {
      // in case mark as read all is limited per category
      await markNotificationGroupAsRead(user, body.category);

      return countUnreadNotifications(user);
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }
}
