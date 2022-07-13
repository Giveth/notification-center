import { Route, Tags, Post, Body, Security, Inject } from 'tsoa';
import { logger } from '../../utils/logger';

import { sendNotificationValidator,
  validateWithJoiSchema,
} from '../../validators/schemaValidators';
import {SendNotificationRequest, SendNotificationResponse} from "../../types/requestResponses";
import {errorMessagesEnum} from "../../utils/errorMessages";
import {StandardError} from "../../types/StandardError";

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
    const {  } = body;
    const { microService } = params;
    try {
      validateWithJoiSchema(body, sendNotificationValidator);
      // TODO insert notification in DB
      // TODO send segment event, email , ...
      // TODO update notification record
      throw new StandardError(
          errorMessagesEnum.NOT_IMPLEMENTED,
      )
    } catch (e) {
      logger.error('generateAccessToken() error', e);
      throw e;
    }
  }
}
