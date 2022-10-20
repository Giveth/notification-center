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
}
