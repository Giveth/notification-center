import { NotificationType } from "../entities/notificationType"


export const getNotificationTypeByEventName = async (
  eventName: string
) => {
  return NotificationType.createQueryBuilder()
    .where('name = :name', { name: eventName })
    .getOne();
}