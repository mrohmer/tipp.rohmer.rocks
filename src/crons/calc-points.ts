import type {CronTupel} from './types';
import {environment} from '../environments/environment';
import {leagueMap} from '../models/kicker/leagues';
import {fetchGames, fetchLeagueInfo} from '../services/kicker-api.service';
import type {Gameday} from '../models/kicker/league-info';
import {getConnection} from 'typeorm';
import {RatedMatch} from '../models/rated-match';
import type {Match} from '../models/kicker/match';
import {Tip} from '../models/tip';
import {Points} from '../models/constants';
import {User} from '../models/user';

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

  const completedMatches = [].concat(...gamedayResponses
    .map(response => response.data.matches.match.filter(match => match.completed === '1'))
  );
  const ratedMatchIds = (await getConnection().getRepository(RatedMatch).find({
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
const saveRatedMatch = async (match: Match) => {
  const ratedMatch = new RatedMatch();
  ratedMatch.matchId = match.id;
  ratedMatch.leagueId = match.leagueId;
  ratedMatch.season = match.seasonId;

  await getConnection().getRepository(RatedMatch).save(ratedMatch);
};
const calcPointsForTip = (tip: Tip, match: Match): number => {
  const {hergEnde, aergEnde} = match.results;
  const matchHome = parseInt(hergEnde);
  const matchGuest = parseInt(aergEnde);
  const {home, guest} = tip;

  const type = matchHome !== matchGuest ? 'victory' : 'draw';
  const pointsObj = Points[type];

  if (matchHome === home && matchGuest === guest) {
    return pointsObj.exact;
  }

  const matchDifference = matchHome - matchGuest;
  const difference = home - guest;
  if ('difference' in pointsObj && matchDifference === difference) {
    return pointsObj.difference;
  }

  if (Math.sign(matchDifference) === Math.sign(difference)) {
    return pointsObj.tendency;
  }

  return 0;
}
const updateTip = async (tip: Tip, match: Match) => {
  const points = calcPointsForTip(tip, match);

  tip.matchCompleted = true;
  tip.points = points;

  await getConnection().getRepository(Tip).save(tip);
}
const processMatch = async (match: Match) => {
  try {
    const tips = await getConnection().getRepository(Tip).find({
      where: {
        matchId: match.id,
      },
    });

    await Promise.all(tips
      .filter(tip => !tip.matchCompleted)
      .map(tip => updateTip(tip, match))
    );

    await saveRatedMatch(match);
  } catch (e) {
    console.error(e);
  }


}
const processLeague = async (leagueId: string) => {
  const unratedMatches = await getUnratedMatchesForLeague(leagueId);

  await Promise.all(unratedMatches.map(processMatch));
};
const recalcSingleUsersPoints = async (user: User) => {
  const conn = getConnection();
  const tips = await conn.getRepository(Tip).find({
    where: {
      userId: user.foreignId,
      matchCompleted: true,
    }
  });
  const points: Record<string, Record<string, number>> = {};
  tips.forEach(tip => {
    if (!points[tip.leagueId]) {
      points[tip.leagueId] = {};
    }
    if (!points[tip.leagueId][tip.season]) {
      points[tip.leagueId][tip.season] = 0;
    }
    points[tip.leagueId][tip.season] += tip.points;
  });

  user.points = points;
  await conn.getRepository(User).save(user);
}
const recalcUersPoints = async () => {
  const users = await getConnection().getRepository(User).find();

  await Promise.all(
    users.map(user => recalcSingleUsersPoints(user))
  )
}
const calcPoints = async () => {
  console.log('starting cronjob calcPoints');
  await Promise.all(
    environment.leagues
      .map(key => leagueMap[key].id)
      .map(id => processLeague(id))
  );
  await recalcUersPoints();

  console.log('done with cronjob calcPoints');
};
export default ['*/3 * * * *', calcPoints] as CronTupel;
