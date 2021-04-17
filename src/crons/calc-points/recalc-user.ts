import type {Points, User} from '../../models/user';
import {getTipRepository, getUserRepository} from './db';
import {In, Not} from 'typeorm';
import type {Change} from './model';
import {log} from './log';
import {arrayUnique} from '../../utils/array-unique';

const calcTotalPointsFromSeasonObj = (points: Record<string, number>): number => Object.values(points)
  .reduce(
    (prev, curr) => prev + curr,
    0,
  );
const calcTotalPointsFromObj = (points: Points): number => Object.values(points)
  .reduce(
    (prev, curr) => prev + calcTotalPointsFromSeasonObj(curr),
    0,
  )
const calcDifferenceForLeague = (previous: Record<string, number>, current: Record<string, number>): Record<string, number> => {
  const seasons = arrayUnique([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]);
  const result: Record<string, number> = {};
  seasons.forEach(key => {
    const difference = (current[key] ?? 0) - (previous[key] ?? 0);
    if (difference > 0) {
      result[key] = difference
    }
  });
  return result;
};
const calcDifference = (previous: Points, current: Points): Points => {
  const leagueIds = arrayUnique([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]);

  const result: Points = {};
  leagueIds.forEach(key => {
    const difference = calcDifferenceForLeague(
      previous[key] ?? {},
      current[key] ?? {},
    );
    if (Object.keys(difference).length > 0) {
      result[key] = difference;
    }
  });
  return result;
}
const recalcSingleUsersPoints = async (user: User): Promise<Points> => {
  const tips = await getTipRepository().find({
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

  const previous = user.points ?? {};
  user.points = points;
  await getUserRepository().save(user);
  return calcDifference(previous, user.points);
}
const getUsersWithTipsForMatchesWithValue = async (matchIds: string[]): Promise<string[]> => {
  const tips = await getTipRepository()
    .find({
      where: {
        matchCompleted: true,
      }
    });
  const userIds = tips
    .filter(({matchId}) => matchIds.includes(matchId))
    .filter(({points}) => points !== 0)
    .map(tip => tip.userId);

  return arrayUnique(userIds);
};
export const recalcUsersPoints = async (matchIds: string[]): Promise<Change[]> => {
  if (!matchIds?.length) {
    return [];
  }

  const userIds = await getUsersWithTipsForMatchesWithValue(matchIds);
  if (!userIds?.length) {
    return [];
  }

  log('updateing users ', JSON.stringify(userIds), ' for matchIds ', JSON.stringify(matchIds));
  const users = await getUserRepository().find();

  const changes = await Promise.all(
    users
      .filter(({foreignId}) => userIds.includes(foreignId))
      .map(user => recalcSingleUsersPoints(user).then(difference => ({difference, user})))
  );

  return changes
    .filter(({difference}) => Object.keys(difference).length > 0);
};
