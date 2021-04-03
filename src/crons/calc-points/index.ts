import {environment} from '../../environments/environment.local';
import {leagueMap} from '../../models/kicker/leagues';
import type {CronTupel} from '../types';
import {recalcUsersPoints} from './recalc-user';
import {processLeague} from './process-league';
import type {Match} from '../../models/kicker/match';
import {arrayUnique} from './utils';
import {addNotifications} from './add-notifications';
import {log} from './log';

const calcPoints = async () => {
  log('starting');
  const matches2Dim = await Promise.all(
    environment.leagues
      .map(key => leagueMap[key].id)
      .map(id => processLeague(id))
  );

  const matchIds = ([] as Match[]).concat(...matches2Dim)
    .map(match => match.id);

  const changes = await recalcUsersPoints(arrayUnique(matchIds));

  await addNotifications(changes);

  log('done');
};
export default ['*/3 * * * *', calcPoints] as CronTupel;
