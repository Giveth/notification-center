import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedThirdPartyForNotifyReward1720828190666
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      // Create third part record for notifyreward in development and test ENVs
      await queryRunner.query(`
                  INSERT INTO third_party(
                  "microService", secret, "isActive")
                  VALUES 
                    ('notifyreward', 'secret', true)
                    ;
                `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                DELETE FROM third_party
                WHERE "microService" = 'notifyreward';
            `);
  }
}
