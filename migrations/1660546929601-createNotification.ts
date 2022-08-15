import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class createNotification1660546929601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // Auto-increment
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'projectId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'walletAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailStatus',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'emailContent',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isRead',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'templateId',
            type: 'int',
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['typeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'notification_type',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['templateId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'notification_template',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'notification',
      new TableForeignKey({
        columnNames: ['userAddressId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_address',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'IDX_NOTY_TEMP_ID',
        columnNames: ['templateId'],
      }),
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'IDX_NOTY_USER_A_ID',
        columnNames: ['userAddressId'],
      }),
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'IDX_NOTY_TYPE_ID',
        columnNames: ['typeId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification');
  }
}
