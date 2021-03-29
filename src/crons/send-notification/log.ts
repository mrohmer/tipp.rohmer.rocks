import {log as parentLog, error as parentError} from '../log';
export const log = (...messages) => parentLog('sendNofication', ...messages);
export const error = (...messages) => parentError('sendNofication', ...messages);
