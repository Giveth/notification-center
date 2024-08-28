import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedThirdPartyForQAcc1723464500207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      // Create third part record for notifyreward in development and test ENVs
      await queryRunner.query(`
          INSERT INTO third_party(
          "microService", secret, "isActive")
          VALUES ('qacc', 'secret', true);
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM third_party
        WHERE "microService" = 'qacc';
    `);
  }
}
