export type CronTupel = [string, () => void|Promise<void>] | [string, () => void|Promise<void>, boolean];
