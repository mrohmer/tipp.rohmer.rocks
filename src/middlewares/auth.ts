import type {Request} from 'polka';
import redirect from '@polka/redirect';

export const secured = (req: any, res): boolean => {
  if (req.user) {
    return true;
  }

  req.session.returnTo = req.originalUrl;
  redirect(res, '/auth/login');
  return false;
}
export const securedMiddleware = (): any => (req: Request, res, next) => {
  if (/\/auth\/(login|callback)/.test(req.path) || secured(req, res)) {
    next();
  }
}
