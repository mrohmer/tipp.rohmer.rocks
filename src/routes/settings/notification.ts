import {getDbUser} from '../../utils/user';

export const get = async (req, res) => {
  const {user} = await getDbUser(req);

  res.end(JSON.stringify({enabled: user.notificationsEnabled}));
};
export const post = async (req, res) => {
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
};
export const del = async (req, res) => {
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
};
