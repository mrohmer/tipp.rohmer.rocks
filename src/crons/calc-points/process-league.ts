import {processMatch} from './process-match';
import type {Gameday} from '../../models/kicker/league-info';
import type {Match} from '../../models/kicker/match';
import {fetchGames, fetchLeagueInfo} from '../../services/kicker-api.service';
import {environment} from '../../environments/environment.local';
import {getRatedMatchRepository} from './db';
import {In} from 'typeorm';

const getPreviousGamedayId = (currentId: string, gamedays: Gameday[]): string => {
  if (!gamedays || !gamedays.length) {
    return null;
  }
  if (!currentId) {
    return gamedays[0].id;
  }
  const currentGamedayIndex = gamedays.findIndex(gameday => gameday.id === currentId);
  return currentGamedayIndex > 0 ? gamedays[currentGamedayIndex - 1].id : null;
}
const getUnratedMatchesForLeague = async (leagueId: string): Promise<Match[]> => {
  const leagueInfo = (await fetchLeagueInfo(leagueId)).data.league;
  const gamedayIds = [leagueInfo.currentRoundId, getPreviousGamedayId(leagueInfo.currentRoundId, leagueInfo.gamedays.gameday)]
    .filter(gamedayId => !!gamedayId);

  const gamedayResponses = await Promise.all(
    gamedayIds
      .map(gamedayId => fetchGames(leagueId, gamedayId))
  );

  const completedMatches = ([] as Match[]).concat(...gamedayResponses
    .map(response => response.data.matches.match.filter(match => match.completed === '1'))
  );
  const ratedMatchIds = (await getRatedMatchRepository().find({
      select: ['matchId'],
      where: {
        leagueId,
        season: environment.overrideSeason ?? leagueInfo.currentSeasonId,
      },
    }))
      .map(match => match.matchId)
  ;
  return completedMatches.filter(
    match => !ratedMatchIds.includes(match.id)
  );
};
export const processLeague = async (leagueId: string): Promise<Match[]> => {
  const unratedMatches = await getUnratedMatchesForLeague(leagueId);

  const matches = await Promise.all(unratedMatches.map(
    match => processMatch(match).then(updated => updated ? match : null)
  ));

  return matches.filter(match => !!match);
};
