import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { SCHEMA_VALIDATORS_NAMES } from '../src/entities/notificationType';
import { MICRO_SERVICES } from '../src/utils/utils';

const QaccNotificationTypes = [
  {
    name: NOTIFICATION_TYPE_NAMES.DONATION_RECEIVED_FOR_QACC,
    description: 'Project has received a donation',
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.DONATION_RECEIVED_FOR_QACC,
  },
];

export class AddNotificationTypesForQacc1723505340806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save('notification_type', QaccNotificationTypes);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const names = QaccNotificationTypes.map(nt => nt.name);
    await queryRunner.query(
      `DELETE FROM notification_type WHERE name IN (${names.map(name => `'${name}'`).join(', ')}) AND "microService" = 'qacc';`,
    );
  }
}
