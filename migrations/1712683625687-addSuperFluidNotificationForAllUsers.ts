import { MigrationInterface, QueryRunner } from "typeorm"

export class addSuperFluidNotificationForAllUsers1712683625687 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First, select all unique userAddressIds
        const uniqueUserAddresses = await queryRunner.query(`
            SELECT DISTINCT "userAddressId" FROM "notification_setting";
        `);

        // Then, for each unique userAddressId, insert the required rows
        for (const address of uniqueUserAddresses) {
            await queryRunner.query(`
                INSERT INTO "notification_setting" (
                    "allowNotifications", 
                    "allowEmailNotification", 
                    "allowDappPushNotification", 
                    "notificationTypeId", 
                    "userAddressId"
                ) VALUES 
                    (true, true, true, 66, '${address.userAddressId}'),
                    (true, true, true, 67, '${address.userAddressId}'),
                    (true, true, true, 68, '${address.userAddressId}');
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // To revert, delete the rows with the specific notificationTypeIds for all userAddressIds
        await queryRunner.query(`
            DELETE FROM "notification_setting" 
            WHERE "notificationTypeId" IN (66, 67, 68);
        `);
    }
}
