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
export const usersArrayUnique = (arr: User[]): User[] => {
  console.log(arr.map(({id}) => id)
    .map((item, index, array) => array.findIndex(i => i.toString() === item.toString())));
  return arr
    .filter((item, index, array) => index === array.findIndex(i => i.id.toString() === item.id.toString()))
}
