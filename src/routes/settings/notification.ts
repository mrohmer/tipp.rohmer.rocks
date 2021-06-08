import {getDbUser} from '../../utils/user';
import {CaptureSentryError} from '../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async get(req, res) {
    const {user} = await getDbUser(req);

    res.end(JSON.stringify({enabled: user.notificationsEnabled}));
  }
  @CaptureSentryError()
  static async post(req, res){
    const {body} = req;
    const {subscription} = body;


    const {repo, user: dbUser} = await getDbUser(req);

    if (!dbUser.notificationSubscriptions) {
      dbUser.notificationSubscriptions = [];
    }
    if (!dbUser.notificationSubscriptions.find(sub => sub.endpoint === subscription.endpoint)) {
      dbUser.notificationSubscriptions.push(subscription);
    }

    dbUser.notificationsEnabled = true;
    await repo.save(dbUser);

    res.end(JSON.stringify({enabled: dbUser.notificationsEnabled}));
  }
  @CaptureSentryError()
  static async del(req, res) {
    const {body} = req;
    const {enabled, subscription} = body;


    const {repo, user: dbUser} = await getDbUser(req);

    if (subscription && dbUser.notificationSubscriptions?.length) {
      dbUser.notificationSubscriptions = dbUser.notificationSubscriptions.filter(
        sub => sub.endpoint !== subscription.endpoint,
      );
    }

    dbUser.notificationsEnabled = enabled && !!dbUser.notificationSubscriptions?.length;
    await repo.save(dbUser);

    res.end(JSON.stringify({enabled: dbUser.notificationsEnabled}));
  }
}
export const get = Handler.get
export const post = Handler.post
export const del = Handler.del
