<script lang="ts">
    import type {Match} from '../../models/kicker/match';

    async function fetchTip(url: string): Promise<any> {
      if (typeof fetch === 'undefined') {
        return Promise.resolve(null);
      }
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          return response.json();
        }
      } catch (e) {
      }
      return Promise.resolve(null);
    }

    export let match: Match;
    export let leagueName: string;

    $: tip = match && leagueName ? fetchTip(`/${leagueName}/match/${match.id}/tip`) : null;
</script>

{#await tip then value}
    {@debug value}
{/await}
