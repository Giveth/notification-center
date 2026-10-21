import { EntityManager } from 'typeorm';
import { AppDataSource } from '../dataSource';

export interface PurgeErasedUserDataResult {
  notifications: number;
  notificationSettings: number;
  userAddresses: number;
}

const normalize = (values: string[]): string[] => [
  ...new Set(values.map(value => value.trim().toLowerCase()).filter(Boolean)),
];

// TypeORM's postgres driver answers a DELETE with [rows, rowCount].
const affectedRows = (result: unknown): number =>
  Array.isArray(result) && typeof result[1] === 'number' ? result[1] : 0;

/**
 * Giveth v6 account erasure (giveth-v6-core#501): delete what this service
 * holds for an erased account, for the calling micro-service only, so another
 * product's notifications for the same wallet are left alone.
 *
 * - its notifications: to one of the wallets, or sent to one of the emails
 *   (the row's email, or the email in the stored segment payload);
 * - its notification settings for those wallets;
 * - the wallets' user_address rows, once nothing else refers to them.
 *
 * One transaction; idempotent, so the caller can retry it freely.
 */
export const purgeErasedUserData = async (params: {
  walletAddresses: string[];
  emails: string[];
  microService: string;
}): Promise<PurgeErasedUserDataResult> => {
  const walletAddresses = normalize(params.walletAddresses);
  const emails = normalize(params.emails);

  return AppDataSource.transaction(async (manager: EntityManager) => {
    const addressRows: { id: number }[] = walletAddresses.length
      ? await manager.query(
          `SELECT id FROM user_address WHERE LOWER("walletAddress") = ANY($1::text[])`,
          [walletAddresses],
        )
      : [];
    const userAddressIds = addressRows.map(row => row.id);

    const notifications = affectedRows(
      await manager.query(
        `DELETE FROM notification n
         USING notification_type t
         WHERE n."notificationTypeId" = t.id
           AND t."microService" = $1
           AND (
             n."userAddressId" = ANY($2::int[])
             OR LOWER(n.email) = ANY($3::text[])
             OR LOWER(n."segmentData"->'payload'->>'email') = ANY($3::text[])
           )`,
        [params.microService, userAddressIds, emails],
      ),
    );

    const notificationSettings = affectedRows(
      await manager.query(
        `DELETE FROM notification_setting s
         USING notification_type t
         WHERE s."notificationTypeId" = t.id
           AND t."microService" = $1
           AND s."userAddressId" = ANY($2::int[])`,
        [params.microService, userAddressIds],
      ),
    );

    const userAddresses = affectedRows(
      await manager.query(
        `DELETE FROM user_address a
         WHERE a.id = ANY($1::int[])
           AND NOT EXISTS (
             SELECT 1 FROM notification n WHERE n."userAddressId" = a.id
           )
           AND NOT EXISTS (
             SELECT 1 FROM notification_setting s WHERE s."userAddressId" = a.id
           )`,
        [userAddressIds],
      ),
    );

    return { notifications, notificationSettings, userAddresses };
  });
};
