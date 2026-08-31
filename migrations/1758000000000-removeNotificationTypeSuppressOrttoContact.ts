import { MigrationInterface, QueryRunner } from 'typeorm';

// Revert giveth-v6-core#457: remove the `Suppress Ortto contact` NotificationType.
//
// #457 was closed as not planned and its v6-core side is reverted in
// Giveth/giveth-v6-core#482, so nothing sends this event any more. The seed that
// created the row (1757000000000) is removed from the directory by the same
// revert, which means its down() can no longer run — so the row has to be
// deleted by a forward migration instead, or it would sit in every deployed
// database with no code able to reach or explain it.
//
// The literals are INLINED rather than imported from the enums, deliberately.
// The revert deletes `NOTIFICATION_TYPE_NAMES.SUPPRESS_ORTTO_CONTACT` and
// `SCHEMA_VALIDATORS_NAMES.SUPPRESS_ORTTO_CONTACT` along with the event, so
// importing them would not compile. A migration describes what the database did
// at a point in time, so it should not depend on symbols the application has
// since dropped anyway.
const SUPPRESS_ORTTO_CONTACT_NAME = 'Suppress Ortto contact';
const SUPPRESS_ORTTO_CONTACT_SCHEMA_VALIDATOR = 'suppressOrttoContact';
const GIVETHIO = 'givethio';
const ORTTO_CATEGORY = 'ortto';

export class removeNotificationTypeSuppressOrttoContact1758000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // SHAPE-QUALIFIED, carried over from the seed's own down(): match every
    // column the seed set, so a row someone has since customised through AdminJS
    // is left alone rather than silently deleted by a rollback that did not
    // create it.
    //
    // This cascades: notification_setting.notificationTypeId is ON DELETE
    // CASCADE and createNotificationSettingsForNewUser() creates one setting per
    // NotificationType for every new user address, so those settings rows go
    // with it. Correct for an ORTTO-category type, whose settings are never
    // consulted — sendNotification skips them entirely.
    await queryRunner.query(
      `DELETE FROM notification_type
        WHERE "name" = $1
          AND "microService" = $2
          AND "category" = $3
          AND "schemaValidator" = $4;`,
      [
        SUPPRESS_ORTTO_CONTACT_NAME,
        GIVETHIO,
        ORTTO_CATEGORY,
        SUPPRESS_ORTTO_CONTACT_SCHEMA_VALIDATOR,
      ],
    );
  }

  public async down(): Promise<void> {
    // Intentionally a no-op. Re-seeding the row would re-enable an event no code
    // can build an activity for: activityCreator has no SUPPRESS branch after the
    // revert, so a request naming it would reach the ORTTO path, produce nothing,
    // and surface as a 500. An un-rollbackable delete of dead config is better
    // than a rollback that restores a trap.
  }
}
