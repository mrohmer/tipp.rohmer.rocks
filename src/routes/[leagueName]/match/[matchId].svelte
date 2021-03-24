<script context="module" lang="ts">
  import type {LeagueInfo} from '../../../models/kicker/league-info';
  import type {Match} from '../../../models/kicker/match';

  const getLeagueInfo = async (fetch: any, leagueName: string): Promise<LeagueInfo> => {
    const res = await fetch(`${leagueName}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw {status: res.status, message: data.message}
    }
  }
  const getMatch = async (fetch: any, leagueName: string, matchId: string): Promise<Match> => {
    const res = await fetch(`${leagueName}/match/${matchId}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw {status: res.status, message: data.message}
    }
  }
  export async function preload({params}: { params: Record<string, string> }) {
    const {leagueName, matchId} = params;

    try {
      const match = await getMatch(this.fetch.bind(this), leagueName, matchId);
      const leagueInfo = await getLeagueInfo(this.fetch.bind(this), leagueName);
      return {match, leagueInfo};
    } catch (e) {
      this.error(e.status, e.message);
    }
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`${leagueName}/match/${matchId}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return {match: data};
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import {stores} from '@sapper/app';
  import MatchHeader from "../../../components/matches/MatchHeader.svelte";
  import Tip from "../../../components/matches/Tip.svelte";

  const {page} = stores();
  export let match: Match;
  export let leagueInfo: LeagueInfo;

  $: gameday = match ? leagueInfo?.gamedays?.gameday.find(gd => gd.id === match.roundId) : null;
</script>

<a href="{$page.params.leagueName}/matches/?gamedayId={match.roundId}">
    back
</a>
<MatchHeader {match} {gameday}/>
<Tip {match} leagueName={$page.params.leagueName} hasHeader={false}/>
