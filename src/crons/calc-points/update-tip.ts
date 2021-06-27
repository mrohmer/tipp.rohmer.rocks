import type {Tip} from '../../models/tip';
import type {Match} from '../../models/kicker/match';
import {Points} from '../../models/constants';
import {getTipRepository} from './db';

const calcPointsForTip = (tip: Tip, match: Match): number => {
  const {hergEnde, aergEnde, hergVerl, aergVerl} = match.results;
  const matchHome = parseInt(hergVerl ?? hergEnde);
  const matchGuest = parseInt(aergVerl ?? aergEnde);
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
export const updateTip = async (tip: Tip, match: Match) => {
  const points = calcPointsForTip(tip, match);

  tip.matchCompleted = true;
  tip.points = points;

  await getTipRepository().save(tip);
}
