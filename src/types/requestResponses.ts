import { Notification } from '../entities/notification';

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

export type SendNotificationResponse = {
  success: boolean;
};
export type GetNotificationsResponse = {
  notifications: Notification[];
  count: number;
};

export type CountUnreadNotificationsResponse = {
  total: number;
  projectsRelated: number;
  givEconomyRelated: number;
  general : number;

  // user's last notificationId, then frontend will know should update notificationList or not
  lastNotificationId : number;
};

export type ReadSingleNotificationResponse = {
  notification: Notification;
};

export type ReadAllNotificationsResponse = {
  success: boolean;
};
