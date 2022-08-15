import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class createNotificationSetting1660541108096
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_setting',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // Auto-increment
            generationStrategy: 'increment',
          },
          {
            name: 'allowNotifications',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'allowEmailNotification',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'allowDappPushNotification',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'typeId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'userAddressId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp without time zone',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp without time zone',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'notification_type',
      new TableIndex({
        name: 'IDX_NOTY_TYPE_NAME',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification_setting');
  }
}
