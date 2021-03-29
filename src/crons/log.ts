export const log = (name: string, ...messages) => console.log('[cron]', name, ...messages);
export const error = (name: string, ...messages) => console.error('[cron]', name, ...messages);
