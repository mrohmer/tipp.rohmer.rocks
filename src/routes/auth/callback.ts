import passport from 'passport';
import redirect from '@polka/redirect';
import {getConnection} from 'typeorm';
import {User} from '../../models/user';
import {v4 as uuid} from 'uuid';
import {CaptureSentryError} from '../../decorators/catch/node';

const addUserToDB = async (user) => {
  const repo = getConnection().getRepository(User);
  let dbUser = await repo.findOne({
    where: {
      foreignId: user.id,
    }
  });

  if (dbUser) {
    return;
  }

  dbUser = new User();
  dbUser.id = uuid();
  dbUser.displayName = user.displayName;
  dbUser.foreignId = user.id;

  await repo.save(dbUser);
}

class Handler {
  @CaptureSentryError()
  static async get(req: any, res, next){
    passport.authenticate('auth0', async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // return redirect(res, '/auth/login');
        return redirect(res, '/auth/failure?type=callbackFailure&info=' + JSON.stringify(info));
      }

      await addUserToDB(user);

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        redirect(res, returnTo || '/');
      });
    })(req, res, next);
  }
}
export const get = Handler.get
