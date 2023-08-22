import { MigrationInterface, QueryRunner } from 'typeorm';
import { getNotificationTypeByEventName } from '../src/repositories/notificationTypeRepository';
import { NOTIFICATION_TYPE_NAMES } from '../src/types/general';

export class changeNotificationCopies1692698983844
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
    const notificationTypesArray = [
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_OWNER,
        data: {
          content:
            'Your project {project name} has been listed on the projects page.',
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
              content: ' has been listed on the projects page.',
            },
          ],
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_OWNER,
        data: {
          content:
            'Your project {project name} has been unlisted from the projects page.',
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
              content: ' has been unlisted from the projects page.',
            },
          ],
        },
      },
    ];
    await Promise.all(
      notificationTypesArray.map(item =>
        this.updateNotificationType(item.eventName, item.data),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
