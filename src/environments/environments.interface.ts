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
  }
}
