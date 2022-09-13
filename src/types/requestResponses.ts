import { Notification, NotificationMetadata } from '../entities/notification';

interface BaseNotificationResponse {
  trackId?: string;
}

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
  sendDappNotification?: boolean;
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
   * @example "0x11be55f4ea41e99a3fb06adda507d99d7bb0a571"
   * @description Sample token for above wallet address and mock authentication service eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWJsaWNBZGRyZXNzIjoiMHgxMUJFNTVGNGVBNDFFOTlBM2ZiMDZBRGRBNTA3ZDk5ZDdiYjBhNTcxIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDIyLTA5LTIzVDA4OjA5OjA2LjQ1N1oiLCJqdGkiOiIxNjYxMzI4NTQ2NDU3LTc1YzNhNGI2YWUiLCJpYXQiOjE2NjEzMjg1NDYsImV4cCI6MTY2MzkyMDU0Nn0.Tdd2f7bCMtg3F1ojX1AQQpJ7smTU7vR7Nixromr0ju4
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

  segmentData: any;
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

export interface SendNotificationResponse extends BaseNotificationResponse {
  success: boolean;
}
export interface GetNotificationsResponse extends BaseNotificationResponse {
  notifications: Notification[];
  count: number;
}

export interface CountUnreadNotificationsResponse
  extends BaseNotificationResponse {
  total: number;
  projectsRelated: number;
  givEconomyRelated: number;
  general: number;

  // user's last notificationId, then frontend will know should update notificationList or not
  lastNotificationId?: number;
}

export interface ReadSingleNotificationResponse
  extends BaseNotificationResponse {
  notification: Notification;
}

export interface ReadAllNotificationsResponse extends BaseNotificationResponse {
  success: boolean;
}

export interface ReadAllNotificationsRequestType {
  /**
   * @example "projectRelated"
   */
  category?: string;
}
