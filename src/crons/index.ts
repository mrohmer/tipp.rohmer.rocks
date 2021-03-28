import cron from 'node-cron';
import calcPoints from './calc-points';

const init = () => {
  const crons = [calcPoints];

  crons.forEach(([pattern, func]) => {
    cron.schedule(pattern, async () => {
      try {
        const result = func();
        if (result instanceof Promise) {
          await result;
        }
      } catch (e) {
        console.error(e);
      }
    })
  })
}

export default init;
