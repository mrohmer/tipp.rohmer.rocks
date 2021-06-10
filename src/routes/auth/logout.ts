import url from 'url';
import util from 'util';
import querystring from 'querystring';
import redirect from '@polka/redirect';
import {environment} from '../../environments/environment';
import {CaptureSentryError} from '../../decorators/catch/node';

class Handler {
  @CaptureSentryError()
  static async get(req, res) {
    req.logout();

    const logoutURL = new url.URL(
      util.format('https://%s/v2/logout', environment.auth.domain)
    );
    logoutURL.search = querystring.stringify({
      client_id: environment.auth.clientID,
      returnTo: environment.auth.logoutRedirect,
    });

    redirect(res, logoutURL.toString());
  }
}
export const get = Handler.get
