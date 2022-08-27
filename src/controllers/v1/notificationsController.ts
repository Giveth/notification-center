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
  createNotification,
  getNotifications,
  markNotificationGroupAsRead,
  markNotificationsAsRead,
} from '../../repositories/notificationRepository';
import { UserAddress } from '../../entities/userAddress';
import {
  getNotificationTypeByEventName,
  getNotificationTypeByEventNameAndMicroservice,
} from '../../repositories/notificationTypeRepository';
import { SCHEMA_VALIDATORS } from '../../utils/validators/segmentValidators';
import { THIRD_PARTY_EMAIL_SERVICES } from '../../utils/utils';
import { EMAIL_STATUSES } from '../../entities/notification';
import { getAnalytics, SegmentEvents } from '../../services/segment/analytics';
import { createNewUserAddressIfNotExists } from '../../repositories/userAddressRepository';

const analytics = getAnalytics();

@Route('/v1')
@Tags('Notification')
export class NotificationsController {
  @Post('/thirdParty/notifications')
  @Security('basicAuth')
  public async sendNotification(
    @Body()
    body: SendNotificationTypeRequest,
    @Inject()
    params: {
      microService: string;
    },
  ): Promise<SendNotificationResponse> {
    const { microService } = params;
    const { userWalletAddress } = body;
    try {
      const userAddress = await createNewUserAddressIfNotExists(
        userWalletAddress as string,
      );
      const notificationType =
        await getNotificationTypeByEventNameAndMicroservice({
          eventName: body.eventName,
          microService,
        });

      if (!notificationType) {
        throw new Error(errorMessages.INVALID_NOTIFICATION_TYPE);
      }
      let emailStatus = body.sendEmail
        ? EMAIL_STATUSES.WAITING_TO_BE_SEND
        : EMAIL_STATUSES.NO_NEED_TO_SEND;
      if (body.sendSegment && notificationType.schemaValidator) {
        const schemaValidator =
          SCHEMA_VALIDATORS[notificationType.schemaValidator as string];
        validateWithJoiSchema(body.segmentData, schemaValidator);
        analytics.track(
          notificationType.emailNotificationId!,
          body.analyticsUserId,
          body.segmentData,
          body.anonymousId,
        );
        emailStatus = EMAIL_STATUSES.SENT;
      }

      await createNotification(
        notificationType,
        userAddress,
        body.email,
        emailStatus,
        body?.metadata,
      );

      return { success: true };
      // add if and logic for push notification (not in mvp)
    } catch (e) {
      logger.error('sendNotification() error', e);
      throw e;
    }
  }

  // https://tsoa-community.github.io/docs/examples.html#parameter-examples
  /**
   * @example limit "20"
   * @example offset "0"
   * @example isRead "true"
   * @example isRead "false"
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

  @Get('/notifications/countUnread')
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
      const [notification] = await markNotificationsAsRead(
        [Number(notificationId)],
        user.id,
      );
      if (!notification) {
        throw new Error(errorMessages.NOTIFICATION_NOT_FOUND);
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

      return countUnreadNotifications(user);
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }
}
