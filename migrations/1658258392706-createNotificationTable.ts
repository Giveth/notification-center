import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNotificationTable1658258392706
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    //                CREATE TABLE IF NOT EXISTS notification
    //                     (
    //                          id SERIAL NOT NULL,
    //                         "userId" text COLLATE pg_catalog."default" NOT NULL,
    //                         "microService" text COLLATE pg_catalog."default" NOT NULL,
    //                         "walletAddress" text COLLATE pg_catalog."default" NOT NULL,
    //                         "projectId" text COLLATE pg_catalog."default" NOT NULL,
    //                         "emailStatus" text COLLATE pg_catalog."default" NOT NULL,
    //                         email text COLLATE pg_catalog."default" NOT NULL,
    //                         "emailContent" text COLLATE pg_catalog."default" NOT NULL,
    //                         content text COLLATE pg_catalog."default" NOT NULL,
    //                         metadata jsonb,
    //                         "templateId" integer,
    //                         "isRead" boolean DEFAULT false,
    //                         CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id),
    //                         CONSTRAINT "FK_11fb817c4c06fd5b1b07a83e185" FOREIGN KEY ("templateId")
    //                             REFERENCES public.notification_template (id) MATCH SIMPLE
    //                             ON UPDATE NO ACTION
    //                             ON DELETE NO ACTION
    //                     )
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`DROP TABLE IF EXISTS notification`);
  }
}
