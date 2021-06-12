import {CaptureSentryError} from '../../decorators/catch/node';
import {DbUserMiddleware} from '../../decorators/middleware/db-user';
import {HasRole} from '../../decorators/middleware/role';
import {getConnection} from 'typeorm';
import {User} from '../../models/user';
import {Group} from '../../models/group';

class Handler {
  private static async getUsers(): Promise<Partial<User & Record<'groups', Group[]>>[]> {
    const users = await getConnection().getRepository(User).find();
    return Promise.all(users.map(async user => {
      const groups = await user.getGroups();
      return {
        ...user.getPublic(),
        groups,
      }
    }));
  }

  private static async getGroups(): Promise<Partial<Group>[]> {
    return getConnection().getRepository(Group).find();
  }

  @CaptureSentryError()
  @DbUserMiddleware()
  @HasRole('admin')
  static async get(req, res) {
    const users = await Handler.getUsers();
    const groups = await Handler.getGroups();

    res.end(JSON.stringify({users, groups}))
  }
}

export const get = Handler.get
