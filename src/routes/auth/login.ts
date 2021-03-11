import passport from 'passport';

export const get = passport.authenticate('auth0', {scope: 'openid email profile', successRedirect: '/'});
