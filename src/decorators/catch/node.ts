import * as Sentry from '@sentry/node';
import {Catch} from './index';

export const CaptureSentryError = (): any =>
  Catch((err, cxt): false => {
    Sentry.captureException(err);
    // always return false to never catch error
    return false;
  });
