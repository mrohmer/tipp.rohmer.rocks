import {leagueMap} from '../../../models/kicker/leagues';
import {getConnection, Not} from 'typeorm';
import {Standings, User} from '../../../models/user';
import {getLeagueInfo} from '../index.json';
import {environment} from '../../../environments/environment.local';

export const get = async (req, res) => {
  const {leagueName} = req.params;

  if (!(leagueName in leagueMap)) {
    res.sendStatus(404);
    return;
  }

  const leagueId = leagueMap[leagueName].id;
  const leagueInfo = await getLeagueInfo(leagueId);
  const season = environment.overrideSeason ?? leagueInfo.currentSeasonId;


  const standings: Standings = (await getConnection().getRepository(User)
    .find())
    .filter(
      ({points}) => !!points
      && points && leagueId in points
      && season in points[leagueId]
    )
    .map(({foreignId, points, displayName}) => ({
      username: displayName,
      points: points[leagueId][season],
      self: req.user.id === foreignId,
    }))
    .sort(((a, b) => a.points > b.points ? -1 : 1))
  ;


  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(standings));
}
