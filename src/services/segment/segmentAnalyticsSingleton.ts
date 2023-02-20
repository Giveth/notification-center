const segmentApiKey = process.env.SEGMENT_API_KEY;
import { SegmentAnalytics } from 'segment-analytics-node';
import { redisConfig } from '../redis';

const options = {
  redisConnectionInfo: {
    host: String(redisConfig.host),
    port: Number(redisConfig.port),
    password: redisConfig.password ? String(redisConfig.password) : undefined,
  },
  requestsPerSecond: 1,
  sleepMilliSecondBetweenEvents: 50,
};
export enum SegmentEvents {
  DRAFTED_PROJECT_ACTIVATED = 'Draft published',
  PROJECT_LISTED = 'Project listed',
  PROJECT_UNLISTED = 'Project unlisted',
  PROJECT_EDITED = 'Project edited',
  PROJECT_BADGE_REVOKED = 'Project badge revoked',
  PROJECT_BADGE_REVOKE_REMINDER = 'Project badge revoke reminder',
  PROJECT_BADGE_REVOKE_WARNING = 'Project badge revoke warning',
  PROJECT_BADGE_REVOKE_LAST_WARNING = 'Project badge revoke last warning',
  PROJECT_BADGE_UP_FOR_REVOKING = 'Project badge up for revoking',
  PROJECT_VERIFIED = 'Project verified',
  PROJECT_REJECTED = 'Project rejected',
  PROJECT_UNVERIFIED = 'Project unverified',
  PROJECT_UNVERIFIED_USERS_WHO_SUPPORTED = 'Project unverified - Users who supported',
  PROJECT_ACTIVATED = 'Project activated',
  PROJECT_DEACTIVATED = 'Project deactivated',
  PROJECT_CANCELLED = 'Project cancelled',
  MADE_DONATION = 'Made donation',
  DONATION_RECEIVED = 'Donation received',
  PROJECT_UPDATE_ADDED_OWNER = 'Project update added - owner',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN = 'Verification form got draft by admin',
}

// one instance running
export class SegmentAnalyticsSingleton {
  private static instance: SegmentAnalyticsSingleton;
  private static segmentAnalyticsInstance: SegmentAnalytics;

  static getInstance(): SegmentAnalyticsSingleton {
    if (!SegmentAnalyticsSingleton.instance) {
      return new SegmentAnalyticsSingleton();
    }
    return SegmentAnalyticsSingleton.instance;
  }

  private constructor() {
    SegmentAnalyticsSingleton.segmentAnalyticsInstance = new SegmentAnalytics(
      segmentApiKey as string,
      options,
    );
    return this;
  }

  async identifyUser(user: {
    segmentUserId: string;
    firstName?: string;
    email?: string;
  }): Promise<void> {
    await SegmentAnalyticsSingleton.segmentAnalyticsInstance.identify({
      userId: user.segmentUserId,
      traits: {
        firstName: user.firstName,
        email: user.email,
        registeredAt: new Date(),
      },
    });
  }

  async track(params: {
    eventName: string;
    analyticsUserId?: string;
    properties: any;
    anonymousId?: string;
  }): Promise<void> {
    const { eventName, analyticsUserId, properties, anonymousId } = params;
    const userId = (analyticsUserId || anonymousId) as string;
    await SegmentAnalyticsSingleton.segmentAnalyticsInstance.track({
      event: eventName,
      userId,
      properties,
      anonymousId,
    });
  }
}
