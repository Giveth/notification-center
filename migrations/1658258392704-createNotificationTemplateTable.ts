import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNotificationTemplateTable1658258392704
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //         CREATE TABLE IF NOT EXISTS notification_template
    //             (
    //                  id SERIAL NOT NULL,
    //                 "userId" integer NOT NULL,
    //                 "walletAddress" text COLLATE pg_catalog."default" NOT NULL,
    //                 "projectId" text COLLATE pg_catalog."default" NOT NULL,
    //                 title text COLLATE pg_catalog."default" NOT NULL,
    //                 type text COLLATE pg_catalog."default" NOT NULL,
    //                 description text COLLATE pg_catalog."default" NOT NULL,
    //                 CONSTRAINT "PK_d2a6ef77141a01b8ac31f514cfc" PRIMARY KEY (id)
    //             )
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE IF EXISTS notification_template`);
  }
}
