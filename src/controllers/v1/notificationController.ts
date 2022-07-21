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
  getNotificationsValidator,
  readSingleNotificationsValidator,
  sendNotificationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {
  GetNotificationsRequest, GetNotificationsResponse, ReadAllNotificationsResponse, ReadSingleNotificationResponse,
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
    const {} = body;
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

  @Get('/')
  @Security('JWT')
  public async getNotifications(
    @Query()
    query: GetNotificationsRequest,
    @Inject()
    params: {
      user: User;
      microService: string;
    },
  ): Promise<GetNotificationsResponse> {
    const {} = query;
    const { user } = params;
    try {
      validateWithJoiSchema(query, getNotificationsValidator);
      // TODO get notifications from db
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('getNotifications() error', e);
      throw e;
    }
  }

  @Put('/read/:notificationId')
  @Security('JWT')
  public async readNotification(
    @Path()
    pathParams: {
      notificationId: string;
    },
    @Inject()
    params: {
      user: User;
      microService: string;
    },
  ): Promise<ReadSingleNotificationResponse> {
    const { user, microService } = params;
    try {
      validateWithJoiSchema(pathParams, readSingleNotificationsValidator);
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
      // TODO update notifications from db
      throw new StandardError(errorMessagesEnum.NOT_IMPLEMENTED);
    } catch (e) {
      logger.error('readNotification() error', e);
      throw e;
    }
  }
}
