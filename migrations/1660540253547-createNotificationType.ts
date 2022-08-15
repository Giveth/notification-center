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
            isNullable: false,
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
            isNullable: false,
          },
          {
            name: 'resourceType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thirdPartyEmailNotifier',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'thirdPartyPushNotifier',
            type: 'varchar',
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

    await queryRunner.createIndex(
      'notification_type',
      new TableIndex({
        name: 'IDX_NOTY_TYPE_RES',
        columnNames: ['resourceType'],
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
