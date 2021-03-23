import {leagueMap} from '../../../models/kicker/leagues';
import {getMatchInfo} from '../../../services/kicker-api.service';
import {environment} from '../../../environments/environment.local';

export const get = async (req, res) => {
  const {matchId, leagueName} = req.params;

  if (!(leagueName in leagueMap) || !environment.leagues.includes(leagueName)) {
    res.sendStatus(404);
    return;
  }
  const leagueId = leagueMap[leagueName].id;
  const response = await getMatchInfo(matchId);
  const data = response.data.match;

  if (data.leagueId !== leagueId) {
    res.sendStatus(404);
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(data));
}
