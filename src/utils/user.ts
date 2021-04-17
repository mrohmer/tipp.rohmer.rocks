import {getConnection} from 'typeorm';
import {User} from '../models/user';
import {arrayUnique} from './array-unique';

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
export const usersArrayUnique = (arr: User[]): User[] => {
  return arrayUnique(arr, (user) => user.id.toString());
}
