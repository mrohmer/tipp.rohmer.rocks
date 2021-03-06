import {leagueMap} from '../../../models/kicker/leagues';
import {getConnection, Not} from 'typeorm';
import {Standings, StandingsByGroup, User} from '../../../models/user';
import {getLeagueInfo} from '../index.json';
import {environment} from '../../../environments/environment';
import type {Group} from '../../../models/group';
import {usersArrayUnique} from '../../../utils/user';
import {CaptureSentryError} from '../../../decorators/catch/node';

const asyncFilter = async <T>(arr: T[], predicate: (item: T) => Promise<boolean>) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}
const getOtherUsersByGroups = (user: User, groups: Group[]): Promise<{ group: Group, users: User[] }[]> => {
  return Promise.all(
    groups.map(async group => ({
      group,
      users: (await group.getUsers())
        .filter(item => item.foreignId !== user.foreignId)
        .filter((item, index, array) => index === array.findIndex(i => i.id === item.id))
    }))
  );
};
const buildStandings = async (users: User[], userId: string, leagueId: string, season: string): Promise<Standings> => {
  const filteredUsers = await asyncFilter(usersArrayUnique(users), async user => {
    const {points} = user;
    const hasPoints = !!points
      && points && leagueId in points
      && season in points[leagueId]
    ;
    if (hasPoints) {
      return true;
    }
    const tips = await user.getTips({
      season,
      leagueId,
    });

    return tips.length > 0
  });
  return filteredUsers.map(({foreignId, points, displayName}) => ({
      username: displayName,
      points: points && points[leagueId] && points[leagueId][season] || 0,
      self: userId === foreignId,
    }))
    .sort(((a, b) => a.points !== b.points ? (a.points > b.points ? -1 : 1) : a.username.toLowerCase().localeCompare(b.username.toLowerCase())))
    .map((item, _, array) => ({
      ...item,
      position: array.findIndex(cur => cur.points === item.points) + 1
    }))
    .map(item => {
      return item;
    })
    ;
};
const flattenGroups = (usersByGroup: { group: Group, users: User[] }[]): User[] => {
  const twoDim = usersByGroup
    .map(({users}) => users);

  return ([] as User[]).concat(...twoDim)
    .filter((item, index, array) => index === array.findIndex(i => i.id === item.id))
}

class Handler {
  @CaptureSentryError()
  static async get(req, res){
    const {leagueName} = req.params;

    if (!(leagueName in leagueMap)) {
      res.sendStatus(404);
      return;
    }

    const leagueId = leagueMap[leagueName].id;
    const leagueInfo = await getLeagueInfo(leagueId);
    const season = environment.overrideSeason ?? leagueInfo.currentSeasonId;

    const user = await getConnection().getRepository(User).findOne({
      where: {
        foreignId: req.user.id
      }
    });

    const groups = await user.getGroups();
    const usersByGroup = await getOtherUsersByGroups(user, groups);
    const allUsers = flattenGroups(usersByGroup);

    const globalStandings: Standings = await buildStandings(
      [user, ...allUsers],
      user.foreignId,
      leagueId,
      season,
    );

    const standingsByGroups: StandingsByGroup[] =
      groups.length > 1
        ? await Promise.all(usersByGroup
          .map(async ({group, users}) => ({
            id: group.id.toString(),
            title: group.name,
            standings: await buildStandings(
              [user, ...users],
              user.foreignId,
              leagueId,
              season,
            )
          })))
        : [];

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify([
      {title: 'Total', standings: globalStandings},
      ...standingsByGroups,
    ]));
  }
}
export const get = Handler.get
