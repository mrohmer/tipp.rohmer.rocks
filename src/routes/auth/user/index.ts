import {getDbUser} from '../../../utils/user';

export const get = async (req, res, next) => {
  const {user} = await getDbUser(req);

  res.end(JSON.stringify(user.getPublic()))
};
