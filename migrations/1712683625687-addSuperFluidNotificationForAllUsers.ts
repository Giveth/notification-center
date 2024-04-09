import { MigrationInterface, QueryRunner } from "typeorm"

export class addSuperFluidNotificationForAllUsers1712683625687 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fetch the notificationTypeIds for the "superfluid" categoryGroup
        const notificationTypeIds = await queryRunner.query(`
            SELECT "id" FROM "notification_type" WHERE "categoryGroup" = 'superfluid';
        `);

        // Fetch all unique userAddressIds
        const userAddressIds = await queryRunner.query(`
            SELECT DISTINCT "userAddressId" FROM "notification_setting";
        `);

        // For each userAddressId, insert a new row for each notificationTypeId
        for (const { userAddressId } of userAddressIds) {
            for (const { id: notificationTypeId } of notificationTypeIds) {
                await queryRunner.query(`
                    INSERT INTO "notification_setting" (
                        "allowNotifications", 
                        "allowEmailNotification", 
                        "allowDappPushNotification", 
                        "notificationTypeId", 
                        "userAddressId"
                    ) VALUES (true, true, true, ${notificationTypeId}, ${userAddressId});
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Fetch the notificationTypeIds for the "superfluid" categoryGroup
        const notificationTypeIds = await queryRunner.query(`
            SELECT "id" FROM "notification_type" WHERE "categoryGroup" = 'superfluid';
        `);

        // Convert fetched rows to a list of IDs for the IN clause
        const ids = notificationTypeIds.map((nt: { id: any; }) => nt.id).join(', ');

        // Delete the rows with the fetched notificationTypeIds for all userAddressIds
        await queryRunner.query(`
            DELETE FROM "notification_setting" WHERE "notificationTypeId" IN (${ids});
        `);
    }
}
