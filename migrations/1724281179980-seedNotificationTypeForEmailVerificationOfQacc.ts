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

const QaccEmailVerificationNotificationType = [
  {
    name: NOTIFICATION_TYPE_NAMES.SEND_EMAIL_VERIFICATION_CODE_FOR_QACC,
    description: 'sending email verification code for the Qacc project.',
    microService: MICRO_SERVICES.qacc,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator:
      SCHEMA_VALIDATORS_NAMES.SEND_EMAIL_VERIFICATION_CODE_FOR_QACC,
    title: 'Qacc email verification',
  },
];

export class SeedNotificationTypeForEmailVerificationOfQacc1724281179980
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      NotificationType,
      QaccEmailVerificationNotificationType,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" = ${NOTIFICATION_TYPE_NAMES.SEND_EMAIL_VERIFICATION_CODE_FOR_QACC};`,
    );
  }
}
