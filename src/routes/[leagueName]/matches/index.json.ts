import {fetchGames,} from "../../../services/kicker-api.service";
import {leagueMap} from "../../../models/kicker/maps";
import type {Match} from '../../../models/kicker/match';
import {getLeagueInfo} from '../index.json';

export const getGamedayMatches = async (leagueId: string, gamedayId: string, seasonId: string): Promise<Match[]> => {
  const response = await fetchGames(leagueId, gamedayId, seasonId);
  return response.data.matches.match;
}
export const get = async (req, res) => {
  const {leagueName} = req.params;
  let {gamedayId} = req.query;

  if (!(leagueName in leagueMap)) {
    res.sendStatus(404);
    return;
  }


  const leagueId = leagueMap[leagueName].id;

  if (!gamedayId) {
    const leagueInfo = await getLeagueInfo(leagueId);
    gamedayId = leagueInfo.currentRoundId ?? '1';

  }

  const matches = await getGamedayMatches(leagueId, gamedayId, '2017')

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(matches));
}
