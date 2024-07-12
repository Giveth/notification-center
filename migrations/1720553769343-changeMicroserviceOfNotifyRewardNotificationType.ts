import { MigrationInterface, QueryRunner } from "typeorm";
import { MICRO_SERVICES } from '../src/utils/utils';

export class changeMicroserviceOfNotifyRewardNotificationType1720553769343 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE notification_type
            SET "microService" = '${MICRO_SERVICES.notifyReward}'
            WHERE name = 'Notify reward amount';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE notification_type
            SET "microService" = '${MICRO_SERVICES.givethio}'
            WHERE name = 'Notify reward amount';
        `);
    }
}
