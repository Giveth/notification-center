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

const notificationTypes = [
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_TO,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_TO,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_OWNERSHIP_CHANGED,
    title: 'Notify Project Owner Changed To',
  },
  {
    name: NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_FROM,
    description: NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_FROM,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.PROJECT_OWNERSHIP_CHANGED,
    title: 'Notify Project Owner Changed From',
  },
];

export class SeedNotificationTypeForProjectOwnershipChanged1722907373955
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(NotificationType, notificationTypes);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" IN 
      (${NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_TO}, 
      ${NOTIFICATION_TYPE_NAMES.PROJECT_OWNERSHIP_CHANGED_FROM});`,
    );
  }
}
