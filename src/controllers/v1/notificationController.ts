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
} from '../../types/requestResponses';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { StandardError } from '../../types/StandardError';
import { User } from '../../types/general';

@Route('/v1/notifications')
@Tags('Notification')
export class NotificationController {
  @Post('/')
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
   * @example startTime "1659356987"
   */
  @Get('/')
  @Security('JWT')
  public async getNotifications(
    @Inject()
    params: {
      user: User;
      microService: string;
    },
    @Query('projectId') projectId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('isRead') isRead?: string,

    // User can say I want notifications after this specific time
    @Query('startTime') startTime?: string,
  ): Promise<GetNotificationsResponse> {
    const { user } = params;
    try {
      validateWithJoiSchema({ projectId }, getNotificationsValidator);
      // TODO get notifications from db
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
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
      user: User;
      microService: string;
    },
  ): Promise<CountUnreadNotificationsResponse> {
    const { user } = params;
    try {
      // TODO get notifications from db
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('getNotifications() error', e);
      throw e;
    }
  }

  /**
   * @example notificationId "1"
   */
  @Put('/read/:notificationId')
  @Security('JWT')
  public async readNotification(
    @Path() notificationId: string,
    @Inject()
    params: {
      user: User;
      microService: string;
    },
  ): Promise<ReadSingleNotificationResponse> {
    const { user, microService } = params;
    try {
      validateWithJoiSchema(
        { notificationId },
        readSingleNotificationsValidator,
      );
      // TODO update notifications from db
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }

  @Put('/readAll')
  @Security('JWT')
  public async readAllUnreadNotifications(
    @Inject()
    params: {
      user: User;
      microService: string;
    },
  ): Promise<ReadAllNotificationsResponse> {
    const { user, microService } = params;
    try {
      // TODO get user's unread notifications count
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }
}
