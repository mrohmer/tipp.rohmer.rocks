import {getDbUser} from '../../../utils/user';
import {CaptureSentryError} from '../../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async get(req, res, next) {
    const {user} = await getDbUser(req);

    res.end(JSON.stringify(user.getPublic()))
  }
}

export const get = Handler.get
