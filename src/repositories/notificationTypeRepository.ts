import { NotificationType } from '../entities/notificationType';

export const getNotificationTypeByEventName = async (eventName: string) => {
  return NotificationType.createQueryBuilder()
    .where('name = :name', { name: eventName })
    .getOne();
};

export const getNotificationTypeByEventNameAndMicroservice = async (
    params : {eventName: string, microService:string}) => {
  return NotificationType.createQueryBuilder()
    .where('name = :name', { name: params.eventName })
    .andWhere('"microService" = :microService', { microService: params.microService })
    .getOne();
};
