import {resolveMatch} from '../[matchId].json';
import {getConnection, Not} from 'typeorm';
import {OthersTip, Tip} from '../../../../models/tip';
import {User} from '../../../../models/user';

export const get = async (req, res) => {
  const {leagueName, matchId} = req.params;

  const match = await resolveMatch(leagueName, matchId);

  if (!match) {
    res.statusCode = 404;
    res.end();
    return;
  }

  let tips = (await getConnection().getRepository(Tip).find({
    where: {
      matchId,
    }
  }))
    .filter(tip => tip.userId !== req.user.id);

  const anonymized = match.completed !== '1';
  let mappedTips: OthersTip[] = [];
  if (tips.length) {
    const users = (await getConnection().getRepository(User).find())
      .filter(user => user.foreignId !== req.user.id);

    mappedTips = tips
      .map(tip => ({
        home: !anonymized ? tip.home : null,
        guest: !anonymized ? tip.guest : null,
        username: users.find(user => user.foreignId === tip.userId).displayName,
        anonymized,
      }));
  }
  res.end(JSON.stringify(mappedTips));
}
