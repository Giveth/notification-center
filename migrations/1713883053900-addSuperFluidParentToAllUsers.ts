import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSuperFluidParentToAllUsers1713883053900
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fetch the notificationTypeIds for the "superfluid" parent
    const notificationTypeId = (
      await queryRunner.query(`
            SELECT "id" FROM "notification_type" WHERE "categoryGroup" = 'superfluid' AND "isGroupParent" = true;
        `)
    ).map((i: any) => i.id)[0];

    // Fetch all unique userAddressIds
    const userAddressIds = await queryRunner.query(`
            SELECT "id" FROM "user_address";
        `);

    // For each userAddressId, insert a new row
    for (const { id } of userAddressIds) {
      await queryRunner.query(`
                INSERT INTO "notification_setting" (
                    "allowNotifications", 
                    "allowEmailNotification", 
                    "allowDappPushNotification", 
                    "notificationTypeId", 
                    "userAddressId"
                ) VALUES (true, true, true, ${notificationTypeId}, ${id});
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Fetch the notificationTypeIds for the "superfluid" categoryGroup
    const notificationTypeId = await queryRunner.query(`
            SELECT "id" FROM "notification_type" WHERE "categoryGroup" = 'superfluid' AND "isGroupParent" = true;
        `);
    const id = notificationTypeId.map((nt: { id: number }) => nt.id)[0];
    // Delete the rows with the fetched notificationTypeId for all userAddressIds
    await queryRunner.query(`
            DELETE FROM "notification_setting" WHERE "notificationTypeId" = ${id};
        `);
  }
}
