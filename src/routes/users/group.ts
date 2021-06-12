import {CaptureSentryError} from '../../decorators/catch/node';
import {DbUserMiddleware} from '../../decorators/middleware/db-user';
import {HasRole} from '../../decorators/middleware/role';
import {getConnection} from 'typeorm';
import {Group} from '../../models/group';

class Handler {
  private static async groupExists(name: string): Promise<boolean> {
    const group = await getConnection().getRepository(Group).findOne({
      name,
    } as any);
    return !!group;
  }

  @CaptureSentryError()
  @DbUserMiddleware()
  @HasRole('admin')
  static async post(req, res) {
    const {body} = req;
    const {name} = body;

    if (!name) {
      res.status = 400;
      res.end('Name may not be empty')
      return;
    }
    if (await Handler.groupExists(name)) {
      res.status = 400;
      res.end('Group already exists')
      return;
    }

    const group = new Group()
    group.name = name;

    await getConnection().getRepository(Group).save(group);

    res.end();
  }
}

export const post = Handler.post
