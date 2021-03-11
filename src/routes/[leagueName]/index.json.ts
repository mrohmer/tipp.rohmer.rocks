import {fetchLeagueInfo} from "../../services/kicker-api.service";
import {leagueMap} from "../../models/kicker/maps";
import type {LeagueInfo} from '../../models/kicker/league-info';
import type {Request} from 'polka';

export const getLeagueInfo = async (leagueId: string): Promise<LeagueInfo> => {
  const response = await fetchLeagueInfo(leagueId);
  return response.data.league;
}
export const get = async (req: Request, res) => {
  const {leagueName} = req.params;

  if (!(leagueName in leagueMap)) {
    res.sendStatus(404);
    return;
  }


  const leagueId = leagueMap[leagueName].id;
  const leagueInfo = await getLeagueInfo(leagueId);

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(leagueInfo));
}
