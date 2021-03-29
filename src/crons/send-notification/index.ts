import type {CronTupel} from '../types';
import {error, log} from './log';
import type {Connection} from 'typeorm';
import {Notification} from '../../models/notification';
import {getConnection} from 'typeorm';
import {Subscription, User} from '../../models/user';
import webPush from 'web-push';
import {environment} from '../../environments/environment';

type UserGetter = (id: string) => Promise<User>;

const sendNotificationToSingleDevice = async ({type, payload}: Notification, subscription: Subscription) => {
  try {
    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        payload,
        type,
      }),
    );
  } catch (e) {
    error(e);
  }
};
const sendNotification = async (notification: Notification, user: User) =>
  await Promise.all(user.notificationSubscriptions.map(
    subscription => sendNotificationToSingleDevice(notification, subscription)
  ));
const processNextNotification = async (connection: Connection, userGetter: UserGetter): Promise<boolean> => {
  const repo = connection.getRepository(Notification);
  const notification = await repo.findOne();

  if (!notification) {
    return false;
  }

  await repo.delete(notification);

  const user = await userGetter(notification.userId);
  if (user.notificationsEnabled) {
    await sendNotification(notification, user);
  }
  return true;
}
const job = async () => {
  log('starting');

  webPush.setVapidDetails(
    `mailto:${environment.push.mail}`,
    environment.push.publicKey,
    environment.push.privateKey,
  );

  const connection = getConnection();
  const userCache: Record<string, User> = {};

  let notificationAvailable: boolean;
  do {
    try {
      notificationAvailable = await processNextNotification(
        connection,
        async (id: string) => {
          if (id in userCache) {
            return userCache[id];
          }
          return connection.getRepository(User).findOne({
            where: {
              foreignId: id,
            }
          });
        }
      );
    } catch (e) {
      error(e);
      notificationAvailable = false;
    }
  } while (notificationAvailable);

  log('done');
};
export default ['59 */2 * * * *', job, true] as CronTupel;
