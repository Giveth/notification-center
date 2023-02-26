import { NotificationType } from '../entities/notificationType';

export const getNotificationTypeByEventName = async (eventName: string) => {
  return NotificationType.createQueryBuilder()
    .where('name = :name', { name: eventName })
    .getOne();
};

export const findNotificationTypeParent = async (categoryGroup: string) => {
  return NotificationType.createQueryBuilder()
    .where('category = :category', {
      category: categoryGroup,
    })
    .andWhere('"isGroupParent" = true')
    .getOne();
};

export const getNotificationTypeByEventNameAndMicroservice = async (params: {
  eventName: string;
  microService: string;
}) => {
  return NotificationType.createQueryBuilder()
    .where('name = :name', { name: params.eventName })
    .andWhere('"microService" = :microService', {
      microService: params.microService,
    })
    .getOne();
};
