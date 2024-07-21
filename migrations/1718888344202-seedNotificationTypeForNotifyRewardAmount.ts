import { MigrationInterface, QueryRunner } from "typeorm"
import { NOTIFICATION_CATEGORY, NOTIFICATION_TYPE_NAMES } from '../src/types/general';
import { MICRO_SERVICES } from '../src/utils/utils';
import { NotificationType, SCHEMA_VALIDATORS_NAMES } from '../src/entities/notificationType';

const NotifyRewardAmountNotificationType = [
    {
        name: NOTIFICATION_TYPE_NAMES.NOTIFY_REWARD_AMOUNT,
        description: NOTIFICATION_TYPE_NAMES.NOTIFY_REWARD_AMOUNT,
        microService: MICRO_SERVICES.givethio,
        category: NOTIFICATION_CATEGORY.GENERAL,
        schemaValidator: SCHEMA_VALIDATORS_NAMES.NOTIFY_REWARD_AMOUNT,
        title: "Notify reward report",
    }
]

export class seedNotificationTypeForNotifyRewardAmount1718888344202 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(NotificationType, NotifyRewardAmountNotificationType);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `DELETE FROM notification_type WHERE "name" = ${NOTIFICATION_TYPE_NAMES.NOTIFY_REWARD_AMOUNT};`,
        );
    }
}
