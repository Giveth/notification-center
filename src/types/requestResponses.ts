import {Notification} from "../entities/notification";

export type SendNotificationRequest = {
  /**
   * @example "1"
   */
  userId: string;

  /**
   * @example "1"
   */
  projectId: string;

  metadata: {
    /**
     * @example 10
     */
    amount?: number;

    /**
     * @example "GIV"
     */
    currency?: string;
  };

  /**
   * @example "y@giveth.io"
   */
  email: string;

  /**
   * @example "projectListed"
   */
  notificationTemplate: number;

  /**
   * @example true
   */
  sendEmail: boolean;
};

export type GetNotificationsRequest = {
  /**
   * @example "1"
   */
  projectId?: string;

  /**
   * @example "50"
   * @default "50"
   */
  limit?: string;

  /**
   * @example "0"
   * @default "0"
   */
  offset?: string;

  /**
   * @example "true"
   */
  isRead?: string;
};

export type SendNotificationResponse = {
  success: boolean;
};
export type GetNotificationsResponse = {
  notifications: Notification[]
  count: number
};

export type ReadSingleNotificationResponse = {
  notification: Notification
};

export type ReadAllNotificationsResponse = {
  success:boolean
};
