import {fetchLeagueInfo} from "../../services/kicker-api.service";
import {leagueMap} from "../../models/kicker/leagues";
import type {LeagueInfo} from '../../models/kicker/league-info';
import type {Request} from 'polka';
import {CaptureSentryError} from '../../decorators/catch/node';

export const getLeagueInfo = async (leagueId: string): Promise<LeagueInfo> => {
  const response = await fetchLeagueInfo(leagueId);
  return response.data.league;
}
class Handler {
  @CaptureSentryError()
  static async get(req: Request, res){
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
}

export const get = Handler.get
