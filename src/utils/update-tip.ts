import type {Tip} from '../models/tip';
import type {Match} from '../models/kicker/match';

export const updateTip = async (leagueName: string, match: Match, data: Tip): Promise<void> => {
  await fetch(`/${leagueName}/match/${match.id}/tip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({home: data.home, guest: data.guest}),
  });
};
