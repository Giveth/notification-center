import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

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
            name: 'isGlobal',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'isGroupParent',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'categoryGroup',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'microService',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'schemaValidator',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'emailNotifierService',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'emailNotificationId',
            type: 'text', // events are strings
            isNullable: true,
          },
          {
            name: 'pushNotifierService',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requiresTemplate',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'htmlTemplate',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'text',
            isNullable: true,
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
