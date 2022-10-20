import Analytics from 'analytics-node';

export enum SegmentEvents {
  DRAFTED_PROJECT_ACTIVATED = 'Draft published',
  PROJECT_LISTED = 'Project listed',
  PROJECT_UNLISTED = 'Project unlisted',
  PROJECT_EDITED = 'Project edited',
  PROJECT_BADGE_REVOKED = 'Project badge revoked',
  PROJECT_VERIFIED = 'Project verified',
  PROJECT_REJECTED = 'Project rejected',
  GIVBACK_ARE_READY_TO_CLAIM = 'We dont have event yet',
  PROJECT_UNVERIFIED = 'Project unverified',
  PROJECT_ACTIVATED = 'Project activated',
  PROJECT_DEACTIVATED = 'Project deactivated',
  PROJECT_CANCELLED = 'Project cancelled',
  SEND_EMAIL_CONFIRMATION = 'Send email confirmation',
  MADE_DONATION = 'Made donation',
  DONATION_RECEIVED = 'Donation received',
  PROJECT_UPDATED_DONOR = 'Project updated - donor',
  PROJECT_UPDATED_OWNER = 'Project updated - owner',
  PROJECT_CREATED = 'Project created',
  UPDATED_PROFILE = 'Updated profile',
  GET_DONATION_PRICE_FAILED = 'Get Donation Price Failed',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN = 'Verification form got draft by admin',
}

const environment = process.env.ENVIRONMENT as string;

// removed segment identify, we must receive from other microservices the id
class GraphAnalytics {
  analytics: Analytics;
  constructor(analytics: Analytics) {
    this.analytics = analytics;
  }

  track(
    eventName: string,
    analyticsUserId?: string,
    properties?: any,
    anonymousId?: string,
  ) {
    let userId;
    if (!analyticsUserId) {
      userId = anonymousId;
    } else {
      userId = analyticsUserId;
    }

    this.analytics.track({
      event: eventName,
      userId: analyticsUserId,
      properties,
      anonymousId,
    });
  }
}

// Enable property defines if it calls segment api or not
// Disabled on tests for time optimization
export function getAnalytics() {
  const segmentAnalytics = new Analytics(
    process.env.SEGMENT_API_KEY as string,
    {
      flushAt: 1,
      enable: environment !== 'test',
    },
  );
  return new GraphAnalytics(segmentAnalytics);
}
