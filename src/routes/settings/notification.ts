import {getDbUser} from '../../utils/user';

export const get = async (req, res) => {
  const {user} = await getDbUser(req);

  res.end(JSON.stringify({enabled: user.notificationsEnabled}));
};
export const post = async (req, res) => {
  const {body} = req;
  const {endpoint} = body;


  const {repo, user: dbUser} = await getDbUser(req);

  if (!dbUser.notificationEndpoints) {
    dbUser.notificationEndpoints = [];
  }
  if (!dbUser.notificationEndpoints.includes(endpoint)) {
    dbUser.notificationEndpoints.push(endpoint);
  }

  dbUser.notificationsEnabled = true;
  await repo.save(dbUser);

  res.end(JSON.stringify({enabled: dbUser.notificationsEnabled}));
};
export const del = async (req, res) => {
  const {body} = req;
  const {enabled, endpoint} = body;


  const {repo, user: dbUser} = await getDbUser(req);

  if (dbUser.notificationEndpoints?.length) {
    dbUser.notificationEndpoints = dbUser.notificationEndpoints.filter(
      e => e !== endpoint,
    );
  }

  dbUser.notificationsEnabled = enabled && !!dbUser.notificationEndpoints?.length;
  await repo.save(dbUser);

  res.end(JSON.stringify({enabled: dbUser.notificationsEnabled}));
};
