import {log as parentLog} from '../log';
export const log = (...messages) => parentLog('calcPoints', ...messages);
