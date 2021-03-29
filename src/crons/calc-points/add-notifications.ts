import {getNotificationRepository} from './db';
import type {Change} from './model';
import {Notification} from '../../models/notification';

const addNotification = async (change: Change) => {
  const notification = new Notification();
  notification.userId = change.user.foreignId;
  notification.type = 'POINTS_UPDATED';
  notification.payload = {points: change.difference};

  await getNotificationRepository().save(notification);
}
export const addNotifications = async (changes: Change[]) =>
  await Promise.all(changes.map(addNotification));
