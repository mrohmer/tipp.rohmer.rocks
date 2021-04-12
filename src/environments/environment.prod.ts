import type {Environment} from './environments.interface';
import {LeagueKey} from '../models/kicker/leagues';

export const environment: Environment = {
  production: true,
  session: {
    secret: process.env.TIPP_SESSION_SECRET,
    path: process.env.TIPP_SESSION_PATH,
  },
  db: {
    URI: process.env.TIPP_MONGO_DB_CONNECTION_STR,
  },
  auth: {
    domain: process.env.TIPP_AUTH_DOMAIN,
    clientID: process.env.TIPP_AUTH_ID,
    clientSecret: process.env.TIPP_AUTH_SECRET,
    callbackURL: process.env.TIPP_AUTH_CALLBACK_URL,
    logoutRedirect: process.env.TIPP_AUTH_LOGOUT_REDIRECT_URL,
  },
  leagues: [
    LeagueKey.EM_U21,
  ],
  push: {
    publicKey: '#{PUSH_PUBLIC}#',
    privateKey: process.env.TIPP_PUSH_PRIVATE,
    mail: process.env.TIPP_PUSH_MAIL,
  },
};
