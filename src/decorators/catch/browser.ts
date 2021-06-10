import * as Sentry from '@sentry/browser';
import {Catch} from './index';

export const CaptureSentryError = (): any =>
  Catch((err, cxt): false => {
    Sentry.captureException(err);
    // always return false to never catch error
    return false;
  });
