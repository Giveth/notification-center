import { MigrationInterface, QueryRunner } from 'typeorm';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';

/**
 * The GIVbacks update policy's warning emails must follow the "Your project
 * status" preference; its revocation notice must not (v6-core issue #440, AC6:
 * "preferences silence warnings, not the policy").
 *
 * Three notification types carry the policy, and all three were seeded with no
 * `categoryGroup` at all:
 *
 *   Project badge revoke warning       -> 45 days silent
 *   Project badge revoke last warning  -> 90 days silent
 *   Project badge revoked              -> 180 days, eligibility removed
 *
 * `categoryGroup` is what the group toggle acts on: switching a group parent off
 * runs `updateChildNotificationSettings`, which cascades `allowEmailNotification`
 * to every NON-parent type sharing that group. With no group, the cascade could
 * never reach these, so an owner who switched "Your project status" off kept
 * receiving all three.
 *
 * This puts the two WARNINGS in `projectStatus` and deliberately leaves
 * `Project badge revoked` outside every group, which is what makes the
 * revocation notice unsuppressible: the cascade is keyed on `categoryGroup`, and
 * that type's own `isEmailEditable` is false (seed default), so it cannot be
 * switched off individually either. `showOnSettingPage` is false for it too, so
 * it is not offered as a choice in the first place.
 *
 * No default changes for the warnings: `PROJECT_STATUS_GROUP` has
 * `emailDefaultValue: true`, and a new user's settings inherit
 * `allowEmailNotification` from the group parent
 * (`createNotificationSettingsForNewUser`), so grouping them keeps them ON by
 * default rather than silently switching them off for everyone.
 */
const WARNING_TYPE_NAMES = [
  'Project badge revoke warning',
  'Project badge revoke last warning',
];

const quoted = (names: string[]) => names.map(n => `'${n}'`).join(', ');

export class groupGivbacksUpdateWarningsUnderProjectStatus1755780000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Bring the two warnings under the group the toggle controls.
    await queryRunner.query(`
      UPDATE "notification_type"
      SET "categoryGroup" = '${NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS}'
      WHERE "name" IN (${quoted(WARNING_TYPE_NAMES)})
    `);

    // 2. Apply the preference the owner already expressed: mirror each user's
    //    "Your project status" email choice onto the two warnings, so the AC
    //    holds for owners who switched the group off BEFORE this migration and
    //    will not toggle it again. Email only — these types have no push
    //    notifier, so their push flag is unused.
    await queryRunner.query(`
      UPDATE "notification_setting" child
      SET "allowEmailNotification" = parentSetting."allowEmailNotification"
      FROM "notification_setting" parentSetting
      JOIN "notification_type" parentType
        ON parentType."id" = parentSetting."notificationTypeId"
      WHERE parentType."categoryGroup" = '${NOTIFICATION_CATEGORY_GROUPS.PROJECT_STATUS}'
        AND parentType."isGroupParent" = true
        AND child."userAddressId" = parentSetting."userAddressId"
        AND child."notificationTypeId" IN (
          SELECT "id" FROM "notification_type"
          WHERE "name" IN (${quoted(WARNING_TYPE_NAMES)})
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Detaching the warnings from the group is what reverses this. Step 2
    // cannot be undone: the pre-migration per-type values are not recorded
    // anywhere.
    await queryRunner.query(`
      UPDATE "notification_type"
      SET "categoryGroup" = NULL
      WHERE "name" IN (${quoted(WARNING_TYPE_NAMES)})
    `);
  }
}
