<script context="module" lang="ts">
  export async function preload({params}: { params: { leagueName: string } }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${params.leagueName}/matches.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {gamedays: data};
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import {Match} from '../../../models/kicker/match';
  import {Gameday} from '../../../models/kicker/league-info';
  import { stores } from '@sapper/app';
  const { page } = stores();

  export let gamedays: { gameday: Gameday, matches: Match[] };
</script>

{#each gamedays as gameday}
    <h3>{gameday.gameday.title}</h3>
    <ul>
        {#each gameday.matches as match}
        <li>
            <a href="{$page.params.leagueName}/matches/{match.id}">
                {match.homeTeam.shortName} - {match.guestTeam.shortName}
            </a>
        </li>
        {/each}
    </ul>
{/each}
