import { MigrationInterface, QueryRunner } from "typeorm"
import { NOTIFICATION_CATEGORY } from '../src/types/general';
import { NotificationType } from '../src/entities/notificationType';
import { MICRO_SERVICES } from '../src/utils/utils';
import { NOTIFICATION_CATEGORY_GROUPS } from '../src/entities/notificationSetting';

export const superFluidNotificationTypes = [
    {
        isGlobal: false,
        isGroupParent: true,
        showOnSettingPage: true,
        webDefaultValue: true,
        emailDefaultValue: true,
        isEmailEditable: true,
        isWebEditable: true,
        name: 'Stream balance warnings',
        description: 'Notify me when any of my Stream Balances are running low',
        microService: MICRO_SERVICES.givethio,
        category: NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS,
        schemaValidator: null,
        emailNotifierService: null,
        emailNotificationId: null,
        pushNotifierService: null,
        categoryGroup: NOTIFICATION_CATEGORY_GROUPS.SUPERFLUID,
        title: 'Stream balance warnings',
    },
]

export class addGroupParentSuperFluid1713834025817 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fetch the notificationTypeIds for the "superfluid" categoryGroup
        const notificationTypeIds = (await queryRunner.query(`
            SELECT "id" FROM "notification_type" WHERE "categoryGroup" = 'superfluid';
        `)).map((i: any) => i.id);
        await queryRunner.query(
          `UPDATE notification_type 
             SET "showOnSettingPage" = false, "emailDefaultValue" = true, "category" = '${NOTIFICATION_CATEGORY.SUPPORTED_PROJECTS}'
             WHERE id IN (${notificationTypeIds.join(", ")})`
        );
        await queryRunner.manager.save(
          NotificationType,
          superFluidNotificationTypes,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `DELETE FROM notification_type WHERE "categoryGroup" = 'superfluid' AND "name" = 'Stream Balance Warnings';`,
        );
    }
}
