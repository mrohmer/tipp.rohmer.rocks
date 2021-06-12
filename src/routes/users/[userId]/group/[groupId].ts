import {CaptureSentryError} from '../../../../decorators/catch/node';
import {DbUserMiddleware} from '../../../../decorators/middleware/db-user';
import {HasRole} from '../../../../decorators/middleware/role';
import {getConnection} from 'typeorm';
import {User} from '../../../../models/user';
import {Group} from '../../../../models/group';
import {UserGroupConnection} from '../../../../models/user-group-connection';
import * as mongodb from 'mongodb';

class Handler {
  private static async userExists(foreignId: string): Promise<boolean> {
    const user = await getConnection().getRepository(User).findOne({
      foreignId,
    });
    return !!user;
  }
  private static async groupExists(id: string): Promise<boolean> {
    const group = await getConnection().getRepository(Group).findOne({
      _id: new mongodb.ObjectID(id),
    } as any);
    return !!group;
  }

  @CaptureSentryError()
  @DbUserMiddleware()
  @HasRole('admin')
  static async post(req, res) {
    const {params} = req;
    const {userId, groupId} = params;

    if (!userId || !(await Handler.userExists(userId))) {
      res.status = 400;
      res.end('User does not exist')
      return;
    }
    if (!groupId || !(await Handler.groupExists(groupId))) {
      res.status = 400;
      res.end('Group does not exist')
      return;
    }

    const connection = new UserGroupConnection()
    connection.userId = userId;
    connection.groupId = groupId;

    await getConnection().getRepository(UserGroupConnection).save(connection);

    res.end();
  }

  @CaptureSentryError()
  @DbUserMiddleware()
  @HasRole('admin')
  static async del(req, res) {
    const {params} = req;
    const {userId, groupId} = params;

    if (!userId || !(await Handler.userExists(userId))) {
      res.status = 400;
      res.end('User does not exist')
      return;
    }
    if (!groupId || !(await Handler.groupExists(groupId))) {
      res.status = 400;
      res.end('Group does not exist')
      return;
    }

    const repo = getConnection().getRepository(UserGroupConnection)
    const connection = await repo.findOne({
      userId,
      groupId,
    });

    if (connection) {
      await repo.delete(connection);
    }

    res.end();
  }
}

export const post = Handler.post
export const del = Handler.del
