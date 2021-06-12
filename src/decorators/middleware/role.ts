import objectHash from 'object-hash';
import {getDbUser} from '../../utils/user';

export const HasRole = (role: string) => <T>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req, res, ...args) => Promise<T>>) => {
  const original = descriptor.value;
  descriptor.value = async (req, res, ...args): Promise<T> => {
    if (req.user?.id && !('dbUser' in req)) {
      const {user} = await getDbUser(req);
      req.dbUser = user;
    }

    const {dbUser} = req;

    if (!dbUser || !dbUser.hasRole(role)) {
      res.statusCode = 403;
      res.end();
      return;
    }

    return original(req, res, ...args)
  }

  return descriptor;
}
