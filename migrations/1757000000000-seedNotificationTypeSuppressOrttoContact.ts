import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';

// giveth-v6-core#457: the v6 → Ortto contact SUPPRESSION event, the mirror of
// `Sync Ortto contact` (migration 1732000000000). ORTTO-category so it sends no
// email and needs no wallet/notification-settings — sendNotification just
// unsubscribes the Ortto person. Must be seeded for the `givethio` microservice
// or v6-core's requests 400 with INVALID_NOTIFICATION_TYPE, which is why
// notification-center deploys BEFORE the v6-core side of #457.
const SuppressOrttoContactNotificationType = [
  {
    name: NOTIFICATION_TYPE_NAMES.SUPPRESS_ORTTO_CONTACT,
    description: NOTIFICATION_TYPE_NAMES.SUPPRESS_ORTTO_CONTACT,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUPPRESS_ORTTO_CONTACT,
  },
];

export class seedNotificationTypeSuppressOrttoContact1757000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Idempotent for the same reason as the sync's seed: NotificationType.name
    // is UNIQUE and migrations gate `start:server:staging`, so a save() that
    // INSERTs a duplicate (row already hand-seeded, created via AdminJS, or
    // left by a down()/re-apply cycle) would raise a duplicate-key error and
    // stop the service booting. Skip when the row already exists.
    const existing = await queryRunner.manager.findOne(NotificationType, {
      where: { name: NOTIFICATION_TYPE_NAMES.SUPPRESS_ORTTO_CONTACT },
    });
    if (existing) {
      return;
    }
    await queryRunner.manager.save(
      NotificationType,
      SuppressOrttoContactNotificationType,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Mirror of up(): remove the row only if it still looks exactly like the one
    // up() seeds. up() deliberately skips insertion when a row already exists —
    // hand-seeded, created through AdminJS, or left by an earlier down()/re-apply
    // cycle are all real cases here — so an unqualified DELETE by name would let
    // a rollback destroy configuration this migration never created. Matching on
    // the full seeded shape keeps a customised row untouched.
    //
    // Note this cascades: notification_setting.notificationTypeId is ON DELETE
    // CASCADE, and createNotificationSettingsForNewUser() creates one setting per
    // NotificationType for every new user address, so the settings rows go with
    // it. That is correct for an ORTTO-category type, whose settings are never
    // consulted (sendNotification skips them entirely), and it is what a rollback
    // of this seed should mean.
    await queryRunner.query(
      `DELETE FROM notification_type
        WHERE "name" = $1
          AND "microService" = $2
          AND "category" = $3
          AND "schemaValidator" = $4;`,
      [
        NOTIFICATION_TYPE_NAMES.SUPPRESS_ORTTO_CONTACT,
        MICRO_SERVICES.givethio,
        NOTIFICATION_CATEGORY.ORTTO,
        SCHEMA_VALIDATORS_NAMES.SUPPRESS_ORTTO_CONTACT,
      ],
    );
  }
}
