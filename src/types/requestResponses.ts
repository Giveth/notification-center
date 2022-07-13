export type CreateDonationRequest = {
  /**
   * @example 10
   */
  amount: number;

  /**
   * @example "GIV"
   */
  currency: string;

  /**
   * @example false
   */
  anonymous: boolean;

  /**
   * @example 0.2403
   */
  priceUsd: number;

  /**
   * @example "0xEf191aeb45A0d6f393D4a592f94152836d5758f8"
   */
  fromWalletAddress: string;

  /**
   * @example "0xa7760455726A8E8aC93cEFcf62B8C461c08e220d"
   */
  toWalletAddress: string;

  /**
   * @example 274
   */
  nonce?: number;

  /**
   * @example "0x9a474c4791e526e35941dd8dd146405f15860fa19aca4abb5e0a4225294c36e0"
   */
  txHash: string;

  /**
   * @example "gnosis"
   */
  network: 'ropsten' | 'mainnet' | 'gnosis';
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
  }

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
  success: boolean
}
