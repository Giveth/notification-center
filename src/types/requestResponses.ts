import {Notification, NotificationMetadata} from '../entities/notification';

export type SendNotificationTypeRequest = {
  /**
   * @example "Made donation"
   */
  eventName: string;
  /**
   * @example false
   */
  sendEmail: boolean;
  /**
   * @example false
   */
  sendSegment: boolean;
  /**
   * @example  false
   */
  sendDappNotification ?: boolean;
  /**
   * @example ""
   */
  analyticsUserId?: string;
  /**
   * @example ""
   */
  anonymousId?: string;
  /**
   * @example ""
   */
  email?: string;
  /**
   * @example "1"
   */
  projectId?: string;
  /**
   * @example "0x11BE55F4eA41E99A3fb06ADdA507d99d7bb0a571"
   */
  userWalletAddress?: string;

  metadata?: {
    /**
     * @example 10
     */
    amount?: number;

    /**
     * @example "GIV"
     */
    currency?: string;
  };

  segmentData: any

};

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

export type ReadSingleNotificationResponse = {
  notification: Notification;
};

export type ReadAllNotificationsResponse = {
  success: boolean;
};

export type CountUnreadNotificationsResponse = {
  total: number;
  projectsRelated: number;
  givEconomyRelated: number;
  general: number;
};
