import {fetchGames, fetchLeagueInfo} from "../../../services/kicker-api.service";
import {leagueMap} from "../../../models/kicker/maps";
import axios from "axios";
import type {Gameday} from '../../../models/kicker/league-info';
import type {Match} from '../../../models/kicker/match';

const fetchGamedays = async (leagueId: string): Promise<{ gameday: Gameday, matches: Match[] }[]> => {
  const leagueInfo = await fetchLeagueInfo(leagueId);
  const gameResponses = await axios
    .all(
      leagueInfo.data.league.gamedays.gameday.map(
        gameday => fetchGames(leagueId, gameday.id, leagueInfo.data.league.currentSeasonId))
    );
  const gamedays = gameResponses
    .map(games => games.data.matches.match)
    .filter(games => games.length)
    .reduce(
      (prev, curr) => ({
        ...prev,
        [curr[0].roundId]: {
          ...(prev[curr[0].roundId] ?? {}),
          matches: curr,
          gameday: leagueInfo.data.league.gamedays.gameday
            .find(gameday => gameday.id === curr[0].roundId)
        }
      }),
      {} as Record<string, { gameday: Gameday, matches: Match[] }>,
    )
  return Object.values(gamedays);
}
export const get = async (req, res) => {
  const {leagueName} = req.params;

  if (!(leagueName in leagueMap)) {
    res.sendStatus(404);
    return;
  }

  const leagueId = leagueMap[leagueName].id;
  const gamedays = await fetchGamedays(leagueId);

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(gamedays));
}
