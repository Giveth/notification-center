import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { MICRO_SERVICES } from '../src/utils/utils';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';

/**
 * giveth-v6-core#439 — event-triggered emails.
 *
 * Two things the v6 email set needs that the v5 seed never provided:
 *
 * 1. **A GIVbacks-eligible badge type (AC4).** v5 had ONE badge, so its
 *    approval reused `Project verified`. v6 has two independent badges — the
 *    verified badge and the GIVbacks-eligible badge — and AC4 requires "the
 *    email for that badge (one each)". Without a distinct type they collapse
 *    into a single template and the owner cannot tell which badge they got.
 *    It joins the `projectStatus` group, so the "My project's status" toggle
 *    covers it like every other badge/status email.
 *
 * 2. **An emailable supporters-update type (AC9).** `Project update added -
 *    Users who supported` exists, but was seeded `emailDefaultValue: false`
 *    and `isEmailEditable: false`. It is its OWN group parent, so that default
 *    cascades to every user: `allowEmailNotification` is false everywhere, and
 *    `sendNotification` gates the Ortto call on it — the email could never
 *    send for anybody. v6 makes this its one supporter-facing email, and
 *    issue #438 defines the "Updates from projects I support" group as
 *    default-ON, so both flags flip.
 *
 *    Flipping every existing row is safe rather than preference-destroying:
 *    `isEmailEditable` was false, so `updateNotificationSetting` refused every
 *    write to it. No stored `false` was ever a user's choice — they are all the
 *    seed default.
 *
 * v5 (impact-graph) sends this event with neither `sendEmail` nor `sendSegment`,
 * so it keeps producing in-app notifications only and is unaffected by either
 * change.
 */
const GIVBACKS_ELIGIBILITY_GRANTED_TYPE = {
  name: NOTIFICATION_TYPE_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
  title: 'GIVbacks eligibility granted',
  description: 'Your project became eligible for GIVbacks',
  microService: MICRO_SERVICES.givethio,
  category: NOTIFICATION_CATEGORY.PROJECT_RELATED,
  categoryGroup: NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
  icon: '',
  schemaValidator: SCHEMA_VALIDATORS_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
  emailNotifierService: null,
  emailNotificationId: null,
  pushNotifierService: null,
  htmlTemplate: [
    {
      type: 'p',
      content: 'Your project ',
    },
    {
      type: 'a',
      content: '$projectTitle',
      href: '$projectLink',
    },
    {
      type: 'p',
      content: ' is now eligible for GIVbacks.',
    },
  ],
  content: 'Your project {project name} is now eligible for GIVbacks.',
};

const SUPPORTERS_UPDATE_TYPE_NAME =
  NOTIFICATION_TYPE_NAMES.PROJECT_UPDATE_ADDED;

export class v6EventTriggeredEmails1756000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. The GIVbacks-eligible badge type.
    await queryRunner.manager.save(NotificationType, [
      GIVBACKS_ELIGIBILITY_GRANTED_TYPE,
    ]);

    // Existing user addresses need a setting row for the new type, or
    // `sendNotification` finds none, `shouldSendEmail` is false, and the email
    // silently drops. Inherit the `projectStatus` group parent's stored value
    // per user so an owner who already switched "Project status" off does not
    // start receiving this one.
    await queryRunner.query(
      `
      INSERT INTO "notification_setting" (
        "allowNotifications",
        "allowEmailNotification",
        "allowDappPushNotification",
        "notificationTypeId",
        "userAddressId",
        "createdAt",
        "updatedAt"
      )
      SELECT
        true,
        COALESCE(parentSetting."allowEmailNotification", true),
        COALESCE(parentSetting."allowDappPushNotification", true),
        newType."id",
        "user_address"."id",
        NOW(),
        NOW()
      FROM "user_address"
      CROSS JOIN (
        SELECT "id" FROM "notification_type" WHERE "name" = $1
      ) AS newType
      LEFT JOIN "notification_type" parentType
        ON parentType."categoryGroup" = $2
       AND parentType."isGroupParent" = true
      LEFT JOIN "notification_setting" parentSetting
        ON parentSetting."notificationTypeId" = parentType."id"
       AND parentSetting."userAddressId" = "user_address"."id"
      WHERE NOT EXISTS (
        SELECT 1 FROM "notification_setting" existing
        WHERE existing."notificationTypeId" = newType."id"
          AND existing."userAddressId" = "user_address"."id"
      )
      `,
      [
        NOTIFICATION_TYPE_NAMES.GIVBACKS_ELIGIBILITY_GRANTED,
        NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS,
      ],
    );

    // 2. Make the supporters-update email sendable and user-controllable.
    await queryRunner.query(
      `
      UPDATE "notification_type"
      SET "emailDefaultValue" = true,
          "isEmailEditable" = true
      WHERE "name" = $1
      `,
      [SUPPORTERS_UPDATE_TYPE_NAME],
    );

    await queryRunner.query(
      `
      UPDATE "notification_setting"
      SET "allowEmailNotification" = true
      WHERE "notificationTypeId" IN (
        SELECT "id" FROM "notification_type" WHERE "name" = $1
      )
      `,
      [SUPPORTERS_UPDATE_TYPE_NAME],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DELETE FROM "notification_setting"
      WHERE "notificationTypeId" IN (
        SELECT "id" FROM "notification_type" WHERE "name" = $1
      )
      `,
      [NOTIFICATION_TYPE_NAMES.GIVBACKS_ELIGIBILITY_GRANTED],
    );
    await queryRunner.query(
      `DELETE FROM "notification_type" WHERE "name" = $1`,
      [NOTIFICATION_TYPE_NAMES.GIVBACKS_ELIGIBILITY_GRANTED],
    );

    // Restore the seeded flags. The per-user values written above are NOT
    // restored: their pre-migration state was uniformly the seed default, and
    // `emailDefaultValue` going back to false is what re-suppresses the email.
    await queryRunner.query(
      `
      UPDATE "notification_type"
      SET "emailDefaultValue" = false,
          "isEmailEditable" = false
      WHERE "name" = $1
      `,
      [SUPPORTERS_UPDATE_TYPE_NAME],
    );
    await queryRunner.query(
      `
      UPDATE "notification_setting"
      SET "allowEmailNotification" = false
      WHERE "notificationTypeId" IN (
        SELECT "id" FROM "notification_type" WHERE "name" = $1
      )
      `,
      [SUPPORTERS_UPDATE_TYPE_NAME],
    );
  }
}
