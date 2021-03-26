import type {LeagueKey} from '../models/kicker/leagues';

export interface Environment {
  production: boolean;
  overrideSeason?: string;
  session: {
    secret: string;
  };
  db: {
    URI: string;
  };
  auth: {
    domain: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    logoutRedirect: string;
  },
  leagues: LeagueKey[];
  push: {
    publicKey: string;
    privateKey: string;
  }
}
