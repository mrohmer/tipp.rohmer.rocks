import passport from 'passport';
import {CaptureSentryError} from '../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async get(req, res, next){
    return passport.authenticate('auth0', {scope: 'openid email profile', successRedirect: '/'})(req, res, next);
  }
}
export const get = Handler.get
