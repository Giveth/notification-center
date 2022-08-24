import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedNotificationTemplates1661310209828
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Gotta seed base templates, most copies are not ready looking at design.
    // https://www.figma.com/file/nVoinu0tgJ565enN5R4WDE/Giveth.io-%26-GIVeconomy?node-id=9820%3A181611
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
