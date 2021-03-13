<script context="module" lang="ts">
  export async function preload({params}: { params: Record<string, string> }) {
    const {leagueName, matchId} = params;

    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${leagueName}/matches/${matchId}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {match: data};
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import {Match} from '../../../models/kicker/match';

  export let match: Match;
</script>

{match.homeTeam.shortName} - {match.guestTeam.shortName}
