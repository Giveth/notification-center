import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class createNotificationType1660540253547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification_type',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // Auto-increment
            generationStrategy: 'increment',
          },
          {
            name: 'microService',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'schemaValidator',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailNotifierService',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailNotificationId',
            type: 'varchar', // events are strings
            isNullable: true,
          },
          {
            name: 'pushNotifierService',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'requiresTemplate',
            type: 'boolean',
            isNullable: false,
            default: true,
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

    await queryRunner.createIndex(
      'notification_type',
      new TableIndex({
        name: 'IDX_NOTY_TYPE_RES',
        columnNames: ['category'],
      }),
    );

    await queryRunner.createIndex(
      'notification_type',
      new TableIndex({
        name: 'IDX_NOTY_TYPE_SERVICE',
        columnNames: ['microService'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification_type');
  }
}
