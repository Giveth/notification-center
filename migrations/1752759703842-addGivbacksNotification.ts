import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { NOTIFICATIONS_EVENT_NAMES } from '../src/types/notifications';
import { MICRO_SERVICES } from '../src/utils/utils';

const GivbacksNotificationType = [
  {
    name: NOTIFICATIONS_EVENT_NAMES.PROJECT_GIVBACKS_ELIGIBLE,
    description: NOTIFICATIONS_EVENT_NAMES.PROJECT_GIVBACKS_ELIGIBLE,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_GIVBACKS_ELIGIBLE,
  },
];

export class AddGivbacksNotification1752759703842
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(NotificationType, GivbacksNotificationType);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" = 'Project givbacks eligible';`,
    );
  }
}
