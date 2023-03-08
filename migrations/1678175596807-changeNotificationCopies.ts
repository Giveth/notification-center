import { MigrationInterface, QueryRunner } from 'typeorm';
import { getNotificationTypeByEventName } from '../src/repositories/notificationTypeRepository';
import { NOTIFICATION_TYPE_NAMES } from '../src/types/general';

export class changeNotificationCopies1678175596807
  implements MigrationInterface
{
  private async updateNotificationType(
    eventName: string,
    data: {
      htmlTemplate?: any;
      content?: string;
      description?: string;
    },
  ) {

    const notificationType = await getNotificationTypeByEventName(eventName);
    if (!notificationType) {
      return;
    }

    for (const key of Object.keys(data)) {
      notificationType[key] = data[key];
    }
    await notificationType.save();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const notificationTableExists = await queryRunner.hasTable('notification_type');
    if (!notificationTableExists) {
      // tslint:disable-next-line:no-console
      console.log(
        'The notification_type table doesnt exist, so it would crash if proceed',
      );
      return;
    }
    const notificationTypesArray = [
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_LISTED_SUPPORTED,
        data: {
          content: '{project name} is now listed on the Giveth projects page',
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' is now listed on the Giveth projects page.',
            },
          ],
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNLISTED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' did not meet our ',
            },
            {
              type: 'a',
              content: 'guidelines for listed projects',
              href: 'https://docs.giveth.io/dapps/listedUnlisted/#listed-projects',
            },
            {
              type: 'p',
              content: ' and has been hidden from the projects page.',
            },
          ],
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_CANCELLED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content:
                ' has been canceled by an admin because it failed to adhere to our ',
            },
            {
              type: 'a',
              content: 'terms of use',
              href: 'https://giveth.io/tos',
            },
            {
              type: 'p',
              content: '.',
            },
          ],
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_ACTIVATED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' has been reactivated.',
            },
          ],
          content: '{project name} has been reactivated',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_DEACTIVATED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' has been deactivated.',
            },
          ],
          content: '{project name} has been deactivated.',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_VERIFIED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'p',
              content: 'Amazing! ',
            },
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' is now verified. You can now donate and receive ',
            },
            {
              type: 'a',
              content: 'GIVbacks',
              href: 'https://docs.giveth.io/giveconomy/givbacks',
            },
            {
              type: 'p',
              content: ' and boost it with ',
            },
            {
              type: 'a',
              content: 'GIVpower',
              href: 'https://docs.giveth.io/giveconomy/givpower',
            },
            {
              type: 'p',
              content: '.',
            },
          ],
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_REMINDER,
        data: {
          htmlTemplate: [
            {
              type: 'p',
              content: 'Your Project ',
            },
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: 'will lose its verification badge soon',
            },
          ],
          content:
            'Your project {project name} will lose its verification badge soon',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_WARNING,
        data: {
          htmlTemplate: [
            {
              type: 'p',
              content: 'Your Project ',
            },
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' will lose its verification badge soon.',
            },
          ],
          content:
            'Your project {project name} will lose its verification badge soon.',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_REVOKE_LAST_WARNING,
        data: {
          htmlTemplate: [
            {
              type: 'p',
              content: 'Your Project ',
            },
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content:
                ' will lose its verification badge soon. this is the last warning.',
            },
          ],
          content:
            'Your project {project name} will lose its verification badge soon, this is the last warning.',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_BADGE_UP_FOR_REVOKING,
        data: {
          htmlTemplate: [
            {
              type: 'p',
              content: 'Your Project ',
            },
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' will lose its verification badge soon.',
            },
          ],
          content:
            'Your project {project name} will lose its verification badge soon.',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UNVERIFIED_SUPPORTED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content:
                ' has lost its verification status. Learn more about our verification requirements',
            },
            {
              type: 'a',
              content: 'here',
              href: 'https://docs.giveth.io/dapps/projectVerification',
            },
            {
              type: 'p',
              content: '.',
            },
          ],
          content:
            '{project name} has lost its verification status. Learn more about our verification requirements here.',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.VERIFICATION_FORM_GOT_DRAFT_BY_ADMIN,
        data: {
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
              content: ' was drafted by an admin.',
            },
          ],
          content: 'Your project {project name} was drafted by an admin.',
          description: 'Verification form was drafted by an admin',
        },
      },
      {
        eventName: NOTIFICATION_TYPE_NAMES.PROJECT_UPDATE_ADDED,
        data: {
          htmlTemplate: [
            {
              type: 'a',
              content: '$projectTitle',
              href: '$projectLink',
            },
            {
              type: 'p',
              content: ' has a new update!',
            },
          ],
          content: '{Project name}  has a new update!',
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
