import type {Points, User} from '../../models/user';
import {getTipRepository, getUserRepository} from './db';
import {In, Not} from 'typeorm';
import {arrayUnique} from './utils';
import type {Change} from './model';
import {log} from './log';

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
const recalcSingleUsersPoints = async (user: User): Promise<number> => {
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
  return calcTotalPointsFromObj(user.points) - calcTotalPointsFromObj(previous);
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
    .filter(({difference}) => difference > 0);
};
