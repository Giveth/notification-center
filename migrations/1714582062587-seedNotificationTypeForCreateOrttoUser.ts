import { MigrationInterface, QueryRunner } from "typeorm"
import { NOTIFICATION_CATEGORY, NOTIFICATION_TYPE_NAMES } from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';
import { NotificationType, SCHEMA_VALIDATORS_NAMES } from '../src/entities/notificationType';

const OrttoUserNotificationType = [
    {
        name: NOTIFICATION_TYPE_NAMES.CREATE_ORTTO_PROFILE,
        description: NOTIFICATION_TYPE_NAMES.CREATE_ORTTO_PROFILE,
        microService: MICRO_SERVICES.givethio,
        category: NOTIFICATION_CATEGORY.ORTTO,
        schemaValidator: SCHEMA_VALIDATORS_NAMES.CREATE_ORTTO_PROFILE,
    }
]

export class seedNotificationTypeForCreateOrttoUser1714582062587 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(NotificationType, OrttoUserNotificationType);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `DELETE FROM notification_type WHERE "name" = 'Create Ortto profile';`,
        );
    }
}
