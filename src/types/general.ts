export type User = {
  id: number;
  walletAddress: string;
  email?: string;
};

export enum NOTIFICATION_CATEGORY {
  PROJECT_RELATED = 'projectRelated',
  DISCUSSION = 'discussion',
  GENERAL = 'general',
  GIV_ECONOMY = 'givEconomy',
  SUPPORTED_PROJECTS = 'supportedProjects',
  GIV_POWER = 'givPower',
  ORTTO = 'ortto',
}

export enum NOTIFICATION_TYPE_NAMES {
  PROJECT_UNLISTED_SUPPORTED = 'Project unlisted - Users who supported',
  PROJECT_LISTED_SUPPORTED = 'Project listed - Users who supported',
  PROJECT_UNLISTED_OWNER = 'Project unlisted',
  PROJECT_LISTED_OWNER = 'Project listed',
  DRAFT_PUBLISHED_OWNER = 'Draft published',
  DRAFT_PROJECT_HAS_BEEN_SAVED_OWNER = 'The project saved as draft',
  EMAIL_NOTIFICATION = 'Email notifications',
  DAPP_NOTIFICATIONS = 'Dapp notifications',
  PROFILE_HAS_BEEN_COMPLETED = 'The profile has been completed',
  INCOMPLETE_PROFILE = 'Incomplete profile',
  WELCOME = 'Welcome',
  ADMIN_MESSAGE = 'Admin message',
  PROJECT_BOOSTED_OWNER = 'Project boosted',
  PROJECT_BOOSTED_BY_PROJECT_OWNER = 'Project boosted by project owner',
  PROJECT_CANCELLED_OWNER = 'Project cancelled',
  PROJECT_CANCELLED_SUPPORTED = 'Project cancelled - Users who supported',
  PROJECT_ACTIVATED_OWNER = 'Project activated',
  PROJECT_ACTIVATED_SUPPORTED = 'Project activated - Users who supported',
  PROJECT_DEACTIVATED_OWNER = 'Project deactivated',
  PROJECT_DEACTIVATED_SUPPORTED = 'Project deactivated - Users who supported',
  PROJECT_VERIFIED_OWNER = 'Project verified',
  PROJECT_VERIFIED_SUPPORTED = 'Project verified - Users who supported',
  PROJECT_UNVERIFIED_OWNER = 'Project unverified',
  PROJECT_UNVERIFIED_SUPPORTED = 'Project unverified - Users who supported',

  PROJECT_BADGE_REVOKE_REMINDER = 'Project badge revoke reminder',
  PROJECT_BADGE_REVOKE_WARNING = 'Project badge revoke warning',
  PROJECT_BADGE_REVOKE_LAST_WARNING = 'Project badge revoke last warning',
  PROJECT_BADGE_UP_FOR_REVOKING = 'Project badge up for revoking',
  VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN = 'Verification form got draft by admin',
  PROJECT_UPDATE_ADDED = 'Project update added - Users who supported',

  // https://github.com/Giveth/impact-graph/issues/774#issuecomment-1542337083
  PROJECT_HAS_A_NEW_RANK = 'Your project has a new rank',
  PROJECT_HAS_RISEN_IN_THE_RANK = 'Your Project has risen in the rank',
  YOUR_PROJECT_GOT_A_RANK = 'Your project got a rank',
  CREATE_ORTTO_PROFILE = 'Create Ortto profile',
}
