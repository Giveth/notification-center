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
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" = 'Suppress Ortto contact';`,
    );
  }
}
