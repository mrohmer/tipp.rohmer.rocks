import {getConnection} from 'typeorm';
import {User} from '../models/user';

export const getDbUser = async (req) => {
  const {user} = req;

  const repo = getConnection().getRepository(User);
  let dbUser = await repo.findOne({
    where: {
      foreignId: user.id,
    }
  });

  if (!dbUser) {
    throw new Error('user not found');
  }

  return {repo, user: dbUser};
}
