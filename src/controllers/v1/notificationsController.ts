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
  sendNotificationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {
  CountUnreadNotificationsResponse,
  GetNotificationsResponse,
  ReadAllNotificationsRequestType,
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
import { EMAIL_STATUSES } from '../../entities/notification';
import { getAnalytics, SegmentEvents } from '../../services/segment/analytics';
import { createNewUserAddressIfNotExists } from '../../repositories/userAddressRepository';
import {SEGMENT_METADATA_SCHEMA_VALIDATOR} from "../../utils/validators/segmentAndMetadataValidators";

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
    const { userWalletAddress, projectId } = body;
    try {
      validateWithJoiSchema(body, sendNotificationValidator);
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

      const segmentValidator = SEGMENT_METADATA_SCHEMA_VALIDATOR[notificationType?.schemaValidator as string]?.segment
      const metadataValidator = SEGMENT_METADATA_SCHEMA_VALIDATOR[notificationType?.schemaValidator as string]?.metadata
      if (body.sendSegment &&
          segmentValidator) {
        validateWithJoiSchema(body.segmentData, segmentValidator);
        analytics.track(
          notificationType.emailNotificationId!,
          body.analyticsUserId,
          body.segmentData,
          body.anonymousId,
        );
        emailStatus = EMAIL_STATUSES.SENT;
      }

      if(metadataValidator){
        validateWithJoiSchema(body.metadata,metadataValidator)
      }
      await createNotification({
        notificationType,
        user: userAddress,
        email: body.email,
        emailStatus,
        metadata: body?.metadata,
        projectId,
      });

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
