import type {Environment} from './environments.interface';
import {LeagueKey} from '../models/kicker/leagues';

export const environment: Environment = {
  production: true,
  session: {
    secret: '#{SESSION_SECRET}#',
    path: '#{SESSION_PATH}#',
  },
  db: {
    URI: '#{MONGO_DB_CONNECTION_STR}#',
  },
  auth: {
    domain: '#{AUTH_DOMAIN}#',
    clientID: '#{AUTH_ID}#',
    clientSecret: '#{AUTH_SECRET}#',
    callbackURL: '#{AUTH_CALLBACK_URL}#',
    logoutRedirect: '#{AUTH_LOGOUT_REDIRECT_URL}#',
  },
  leagues: [
    LeagueKey.EM,
    LeagueKey.EM_U21,
  ],
  push: {
    publicKey: '#{PUSH_PUBLIC}#',
    privateKey: '#{PUSH_PRIVATE}#',
    mail: '#{PUSH_MAIL}#',
  },
};
