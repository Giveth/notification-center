import { MigrationInterface, QueryRunner } from 'typeorm';
import { getNotificationTypeByEventName } from '../src/repositories/notificationTypeRepository';
import { NOTIFICATION_TYPE_NAMES } from '../src/types/general';

export class changeCancelProjectNotificationCopies1681206838965
  implements MigrationInterface
{
  private async updateNotificationType(
    eventName: string,
    data: {
      htmlTemplate?: any;
      content?: string;
    },
  ) {
    const notificationType = await getNotificationTypeByEventName(eventName);
    if (!notificationType) {
      return;
    }
    notificationType.htmlTemplate = data.htmlTemplate;
    notificationType.content = data.content;
    await notificationType.save();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      // Running these migrations in test and development environments would make the tests fail
      // because the notification types are not created in the test database
      // In future we should use raw SQL queries to update the notification types
      return;
    }
    await this.updateNotificationType(
      NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_OWNER,
      {
        htmlTemplate: [
          {
            type: 'p',
            content: 'Your project ',
          },
          {
            type: 'a',
            content: '$projectTitle',
            href: '$projectLink',
          },
          {
            type: 'p',
            content:
              ' has been canceled by an admin. More information can be found in our ',
          },
          {
            type: 'a',
            content: 'terms of service',
            href: 'https://giveth.io/tos',
          },
          {
            type: 'p',
            content: '.',
          },
        ],
        content:
          'Your project {project name} has been canceled by an admin. More information can be found in our {terms of service}.',
      },
    );

    await this.updateNotificationType(
      NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
      {
        htmlTemplate: [
          {
            type: 'a',
            content: '$projectTitle',
            href: '$projectLink',
          },
          {
            type: 'p',
            content: ' which you supported, has been canceled by an admin.',
          },
        ],
        content:
          '{project name} which you supported, has been canceled by an admin.',
      },
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
