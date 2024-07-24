import { MigrationInterface, QueryRunner } from 'typeorm';
import { NotificationType } from '../src/entities/notificationType';

export class changeSeedNotificationTypeForGIVbackNotification1721823068405
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.update(
      NotificationType,
      { name: 'GIVback is ready to claim' },
      {
        htmlTemplate: [
          {
            type: 'p',
            content: 'You have ',
          },
          {
            type: 'a',
            content: 'GIVbacks',
            href: '/givbacks',
          },
          {
            type: 'p',
            content: ' waiting to be claimed!',
          },
        ],
        content: 'You have GIVbacks waiting to be claimed!',
      },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.update(
      NotificationType,
      { name: 'GIVback is ready to claim' },
      {
        htmlTemplate: [
          {
            type: 'p',
            content: 'Your GIVback ',
          },
          {
            type: 'b',
            content: '$amount',
          },
          {
            type: 'p',
            content: ' GIV is ready to claim! ',
          },
          { type: 'br' },
          {
            type: 'a',
            content: 'Click here',
            href: '/givbacks',
          },
          {
            type: 'p',
            content: ' to take a shortcut.',
          },
        ],
        content:
          'Your GIVback {amount} GIV is ready to claim! \n[Click here] to take a shortcut.',
      },
    );
  }
}
