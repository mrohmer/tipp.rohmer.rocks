import sirv from 'sirv';
import polka, {Middleware} from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import {environment} from './environments/environment';
import {createConnection} from 'typeorm';
import {User} from './models/user';
import {json} from 'body-parser';
import session from 'express-session';
import SessionFileStore from 'session-file-store';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import {securedMiddleware} from './middlewares/auth';
import {Tip} from './models/tip';
import cron from './crons';
import {RatedMatch} from './models/rated-match';
import {Notification} from './models/notification';

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';

const FileStore = new SessionFileStore(session);
const passportStrategy = new Auth0Strategy(
  {
    ...environment.auth,
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
)
passport.use(passportStrategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const app = polka(); // You can also use Express
;(async () => {
  await createConnection({
    type: 'mongodb',
    url: environment.db.URI,
    useUnifiedTopology: true,
    entities: [
      User,
      Tip,
      RatedMatch,
      Notification,
    ],
  })

  cron();

  app
    .use(
      json(),
      session({
        secret: environment.session.secret,
        resave: true,
        saveUninitialized: true,
        cookie: {
          maxAge: 2592000000,
          secure: environment.production,
        },
        store: new FileStore({
          path: environment.session.path ?? `.sessions`,
        }),
        proxy: environment.production,
      }),
      passport.initialize(),
      passport.session(),
      compression({threshold: 0}),
      sirv('static', {dev}),
      securedMiddleware(),
      sapper.middleware({
        session: (req, res) => ({
          token: req.session.token,
        }),
      }),
    )
    .listen(PORT, err => {
      if (err) console.log('error', err);
    });
})()
