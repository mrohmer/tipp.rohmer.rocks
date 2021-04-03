import {log as parentLog, error as parentError} from '../log';
export const log = (...messages) => parentLog('createReminder', ...messages);
export const error = (...messages) => parentError('createReminder', ...messages);
