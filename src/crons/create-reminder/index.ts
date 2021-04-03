import type {CronTupel} from '../types';
import {log} from './log';
import {environment} from '../../environments/environment';
import {leagueMap} from '../../models/kicker/leagues';
import {KickerApiService} from '../../services/kicker-api.service';
import type {Match} from '../../models/kicker/match';
import {getConnection} from 'typeorm';
import {User} from '../../models/user';
import {Tip} from '../../models/tip';
import {Notification} from '../../models/notification';
import ms from 'ms';

const getRemindableGames = async (leagueId: string): Promise<Match[]> => {
  const leagueInfo = await KickerApiService.fetchLeagueInfo(leagueId);
  const games = await KickerApiService.fetchGames(leagueId, leagueInfo.data.league.currentRoundId);

  const notStartedGames = games.data.matches.match
    .filter(
      match => !('results' in match)
    );

  const offsetMax = ms('10m');
  const offsetMin = ms('1m');

  return notStartedGames
    .filter(({date}) => {
      const obj = new Date(date);
      const now = new Date();

      const diff = +obj - +now;

      return diff < offsetMax && diff > offsetMin;
    })
  ;
};
const findUsersWithoutTipForMatch = async (matchId: string, users: User[]) => {
  const tips = await getConnection().getRepository(Tip).find({
    where: {
      matchId,
    }
  });

  const userIds = tips.map(({userId}) => userId);

  return users.filter(({foreignId}) => !userIds.includes(foreignId));
};
const createNotification = async (match: Match, user: User) => {
  const leagueKey = Object.keys(leagueMap)
    .find(key => leagueMap[key].id === match.leagueId)

  const notification = new Notification();
  notification.type = 'REMINDER';
  notification.userId = user.foreignId;
  notification.payload = {
    matchId: match.id,
    home: match.homeTeam.shortName,
    guest: match.guestTeam.shortName,
    date: match.date,
    league: leagueKey
  };

  await getConnection()
    .getRepository(Notification)
    .save(notification)
  ;
};
const createNotifications = (match: Match, users: User[]) => Promise.all(
  users.map(user => createNotification(match, user))
)
const processLeague = async (leagueId: string, users: User[])=> {
  const games = await getRemindableGames(leagueId);
  const userMatchArray = await Promise.all(
    games.map(async match => ({
      match,
      users: await findUsersWithoutTipForMatch(match.id, users)
    }))
  );

  await Promise.all(
    userMatchArray
      .filter(({users}) => !!users?.length)
      .map(({match, users}) => createNotifications(match, users))
  )
};
const job = async () => {
  log('starting');

  const users = await getConnection().getRepository(User).find({
    where: {
      notificationsEnabled: true
    }
  })

  const leagueIds = environment.leagues
    .map(key => leagueMap[key].id);

  await Promise.all(
    leagueIds.map(id => processLeague(id, users))
  )

  log('done');
};
export default ['*/10 * * * *', job] as CronTupel;
