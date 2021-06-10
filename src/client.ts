import * as sapper from '@sapper/app';
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import {environment} from './environments/environment';

Sentry.init({
	dsn: environment.sentry?.frontend,
	integrations: [new Integrations.BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

sapper.start({
	target: document.querySelector('#sapper')
});
