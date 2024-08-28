import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  NotificationType,
  SCHEMA_VALIDATORS_NAMES,
} from '../src/entities/notificationType';
import {
  NOTIFICATION_CATEGORY,
  NOTIFICATION_TYPE_NAMES,
} from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';

const OnboardingNotificationType = [
  {
    name: NOTIFICATION_TYPE_NAMES.SUBSCRIBE_ONBOARDING,
    description: NOTIFICATION_TYPE_NAMES.SUBSCRIBE_ONBOARDING,
    microService: MICRO_SERVICES.givethio,
    category: NOTIFICATION_CATEGORY.ORTTO,
    schemaValidator: SCHEMA_VALIDATORS_NAMES.SUBSCRIBE_ONBOARDING,
  },
];

export class seedNotificationTypeForOnboardingGuide1719410008992
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      NotificationType,
      OnboardingNotificationType,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM notification_type WHERE "name" = 'Subscribe onboarding';`,
    );
  }
}
