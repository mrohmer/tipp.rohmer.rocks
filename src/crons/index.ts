import cron from 'node-cron';
import calcPoints from './calc-points';
import sendNotification from './send-notification';

const init = () => {
  const crons = [calcPoints, sendNotification];

  crons.forEach(async ([pattern, func, instant]) => {
    const callback = async () => {
      try {
        const result = func();
        if (result instanceof Promise) {
          await result;
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (instant) {
      await callback();
    }
    cron.schedule(pattern, callback)
  })
}

export default init;
