import {resolveMatch} from '../[matchId].json';
import {getConnection, Not} from 'typeorm';
import type {OthersTip} from '../../../../models/tip';
import {User} from '../../../../models/user';
import {CaptureSentryError} from '../../../../decorators/catch/node';

const getOtherUsers = async (user: User): Promise<User[]> => {
  const groups = await user.getGroups();

  const users2Dim = await Promise.all(
    groups.map(group => group.getUsers())
  );

  let users = ([] as User[]).concat(...users2Dim)

  return users
    .filter(item => item.foreignId !== user.foreignId)
    .filter((item, index, array) => index === array.findIndex(i => i.id === item.id))
    ;
};
class Handler {
  @CaptureSentryError()
  static async get(req, res) {
    const {leagueName, matchId} = req.params;

    const match = await resolveMatch(leagueName, matchId);

    if (!match) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const user = await getConnection().getRepository(User).findOne({
      where: {
        foreignId: req.user.id,
      }
    });

    const otherUsers = await getOtherUsers(user);
    const tips = (await Promise.all(
      otherUsers.map(user => user.getTip(matchId)),
      ))
        .filter(tip => !!tip)
    ;

    const anonymized = !('results' in match);
    let mappedTips: OthersTip[] = [];
    if (tips.length) {
      mappedTips = tips
        .map(tip => ({
          home: !anonymized ? tip.home : null,
          guest: !anonymized ? tip.guest : null,
          username: otherUsers.find(user => user.foreignId === tip.userId).displayName,
          anonymized,
        }));
    }
    res.end(JSON.stringify(mappedTips));
  }
}
export const get = Handler.get
