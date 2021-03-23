import type {Environment} from './environments.interface';
import {LeagueKey} from '../models/kicker/leagues';

export const environment: Environment = {
  production: true,
  session: {
    secret: '__SESSION_SECRET__',
  },
  db: {
    URI: '__MONGO_DB_CONNECTION_STR__',
  },
  auth: {
    domain: '__AUTH_DOMAIN__',
    clientID: '__AUTH_ID__',
    clientSecret: '__AUTH_SECRET__',
    callbackURL: '__AUTH_CALLBACK_URL__',
    logoutRedirect: '__AUTH_LOGOUT_REDIRECT_URL__',
  },
  leagues: [
    LeagueKey.EM,
    LeagueKey.EM_U21,
  ],
};
