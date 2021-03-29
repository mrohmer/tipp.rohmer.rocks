import {getNotificationRepository} from './db';
import type {Change} from './model';
import {Notification} from '../../models/notification';
import {KickerApiService} from '../../services/kicker-api.service';
import {leagueMap} from '../../models/kicker/leagues';

const getCurrentSeason = async (leagueId: string): Promise<string> => {
  const leagueInfo = await KickerApiService.fetchLeagueInfo(leagueId);

  return leagueInfo?.data?.league?.currentSeasonId;
}
const addNotification = async (change: Change) => {
  const promises = Object.entries(change.difference).map(
    async ([leagueId, value]) => {
      const currentSeason = await getCurrentSeason(leagueId);
      if (!(currentSeason in value)) {
        return;
      }

      const league = Object.entries(leagueMap)
        .map(([key, {id, name}]) => ({id, key, name}))
        .find(({id}) => id === leagueId)
      ;

      const notification = new Notification();
      notification.userId = change.user.foreignId;
      notification.type = 'POINTS_UPDATED';
      notification.payload = {difference: value[currentSeason], league};

      await getNotificationRepository().save(notification);
    }
  )

  await Promise.all(promises);
}
export const addNotifications = async (changes: Change[]) =>
  await Promise.all(changes.map(addNotification));
