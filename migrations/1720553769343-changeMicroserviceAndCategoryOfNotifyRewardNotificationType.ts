import { MigrationInterface, QueryRunner } from 'typeorm';
import { MICRO_SERVICES } from '../src/utils/utils';
import { NOTIFICATION_CATEGORY } from '../src/types/general';

export class changeMicroserviceAndCategoryOfNotifyRewardNotificationType1720553769343
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE notification_type
            SET "microService" = '${MICRO_SERVICES.notifyReward}',
                category = '${NOTIFICATION_CATEGORY.ORTTO}'
            WHERE name = 'Notify reward amount';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE notification_type
            SET "microService" = '${MICRO_SERVICES.givethio}',
                categoty = '${NOTIFICATION_CATEGORY.GENERAL}'
            WHERE name = 'Notify reward amount';
        `);
  }
}
