import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedThirdparties1661591058266 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      // Create third part record for givethio in development and test ENVs
      await queryRunner.query(`
                  INSERT INTO third_party(
                  "microService", secret, "isActive")
                  VALUES ('givethio', 'givethio_secret', true);
                `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM third_party`);
  }
}
