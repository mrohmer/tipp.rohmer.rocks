import {leagueMap} from '../../../models/kicker/leagues';
import {getMatchInfo} from '../../../services/kicker-api.service';
import type {Match} from '../../../models/kicker/match';
import {environment} from '../../../environments/environment';
import type {LeagueKey} from '../../../models/kicker/leagues';

export const resolveMatch = async (leagueName: LeagueKey, matchId: string): Promise<Match> => {
  if (!(leagueName in leagueMap) || !environment.leagues.includes(leagueName)) {
    return null;
  }
  const leagueId = leagueMap[leagueName].id;
  const response = await getMatchInfo(matchId);
  const data = response.data.match;

  if (data.leagueId !== leagueId) {
    return null;
  }
  return data;
}
export const get = async (req, res) => {
  const {matchId, leagueName} = req.params;

  const match = await resolveMatch(leagueName, matchId)
  if (!match) {
    res.sendStatus(404);
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(match));
}
