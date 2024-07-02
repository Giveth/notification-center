import { MigrationInterface, QueryRunner } from "typeorm"
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';
import { NotificationType, SCHEMA_VALIDATORS_NAMES } from '../src/entities/notificationType';
import { NOTIFICATIONS_EVENT_NAMES } from '../src/types/notifications';

const EmailConfirmationNotificationType = [
    {
        name: NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION,
        description: NOTIFICATIONS_EVENT_NAMES.SEND_EMAIL_CONFIRMATION,
        microService: MICRO_SERVICES.givethio,
        category: NOTIFICATION_CATEGORY.ORTTO,
        schemaValidator: SCHEMA_VALIDATORS_NAMES.SEND_EMAIL_CONFIRMATION,
    }
]

export class seedNotificationTypeForSendEmailConfirmation1719224595366 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(NotificationType, EmailConfirmationNotificationType);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `DELETE FROM notification_type WHERE "name" = 'Send email confirmation';`,
        );
    }
}
