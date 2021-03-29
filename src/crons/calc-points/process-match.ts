import type {Match} from '../../models/kicker/match';
import {RatedMatch} from '../../models/rated-match';
import {updateTip} from './update-tip';
import {getRatedMatchRepository, getTipRepository} from './db';

const saveRatedMatch = async (match: Match) => {
  const ratedMatch = new RatedMatch();
  ratedMatch.matchId = match.id;
  ratedMatch.leagueId = match.leagueId;
  ratedMatch.season = match.seasonId;

  await getRatedMatchRepository().save(ratedMatch);
};
export const processMatch = async (match: Match): Promise<boolean> => {
  try {
    const tips = await getTipRepository().find({
      where: {
        matchId: match.id,
      },
    });

    await Promise.all(tips
      .filter(tip => !tip.matchCompleted)
      .map(tip => updateTip(tip, match))
    );

    await saveRatedMatch(match);

    return !!tips.length;
  } catch (e) {
    console.error(e);
    return false;
  }
}
