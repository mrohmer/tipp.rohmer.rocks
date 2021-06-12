import objectHash from 'object-hash';
import {getDbUser} from '../../utils/user';

export const DbUserMiddleware = () => <T>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req, ...args) => Promise<T>>) => {
  const original = descriptor.value;
  descriptor.value = async (req, ...args): Promise<T> => {
    if (req.user?.id && !('dbUser' in req)) {
      const {user} = await getDbUser(req);
      req.dbUser = user;
    }

    return original(req, ...args)
  }

  return descriptor;
}
