import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueConstraintOnNotificationTypeName1723505195659
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Dropping the unique constraint on the name column
    await queryRunner.query(
      `ALTER TABLE notification_type DROP CONSTRAINT IF EXISTS "UQ_notification_type_name";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-adding the unique constraint if you need to roll back the migration
    await queryRunner.query(
      `ALTER TABLE notification_type ADD CONSTRAINT "UQ_notification_type_name" UNIQUE (name);`,
    );
  }
}
