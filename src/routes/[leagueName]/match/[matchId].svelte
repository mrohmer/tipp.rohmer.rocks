<script context="module" lang="ts">
  import type {LeagueInfo} from '../../../models/kicker/league-info';
  import type {Match} from '../../../models/kicker/match';
  import {Tip as TipModel} from '../../../models/tip';
  import type {OthersTip} from '../../../models/tip';

  async function getLeagueInfo(leagueName: string): Promise<LeagueInfo> {
    const res = await this.fetch(`${leagueName}.json`);

    if (res.status === 200) {
      return await res.json();
    } else {
      throw {status: res.status}
    }
  }
  async function getMatch(leagueName: string, matchId: string): Promise<Match> {
    const res = await this.fetch(`${leagueName}/match/${matchId}.json`);

    if (res.status === 200) {
      return await res.json();
    } else {
      throw {status: res.status}
    }
  }
  async function getTip(leagueName: string, matchId: string): Promise<TipModel> {
    const res = await this.fetch(`${leagueName}/match/${matchId}/tip`);

    if (res.status === 200) {
      return await res.json();
    } else if(res.status === 404) {
      return new TipModel();
    }
    else {
      throw {status: res.status}
    }
  }
  async function getOtherTips(leagueName: string, matchId: string): Promise<OthersTip[]> {
    const res = await this.fetch(`${leagueName}/match/${matchId}/other-tips`);

    if (res.status === 200) {
      return await res.json();
    } else {
      throw {status: res.status}
    }
  }
  export async function preload({params}: { params: Record<string, string> }) {
    const {leagueName, matchId} = params;

    try {
      const match = await getMatch.call(this, leagueName, matchId);
      const leagueInfo = await getLeagueInfo.call(this, leagueName);
      const ownTip = await getTip.call(this, leagueName, matchId);
      const otherTips = await getOtherTips.call(this, leagueName, matchId);
      return {match, leagueInfo, ownTip, otherTips};
    } catch (e) {
      console.log(e);
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  import {stores} from '@sapper/app';
  import MatchHeader from "../../../components/matches/MatchHeader.svelte";
  import TipTable from "../../../components/matches/TipTable.svelte";
  import type {Tip} from '../../../models/tip';
  import {updateTip as updateTipUtil} from '../../../utils/update-tip';
  import Icon from '../../../components/Icon.svelte';

  async function updateTip(data: TipModel) {
    console.log(data);
    loading = true;

    try {
      await updateTipUtil($page.params.leagueName, match, data);
      ownTip = data;
    } catch (e) {
      error = true;
      console.log(e);
    } finally {
      loading = false;
    }
  }

  const {page} = stores();
  export let match: Match;
  export let leagueInfo: LeagueInfo;
  export let ownTip: Tip;
  export let otherTips: OthersTip[];
  let loading = false;
  let error = false;

  $: gameday = match ? leagueInfo?.gamedays?.gameday.find(gd => gd.id === match.roundId) : null;
</script>

<style type="text/scss">
    .match-detail {
      :global(.tip-table) {
        margin-top: 50px;
      }
    }
</style>

<a href="{$page.params.leagueName}/matches/?gamedayId={match.roundId}">
    <Icon>arrow-left</Icon>
</a>
<div class="match-detail">
    <MatchHeader {match} {gameday}/>
    <TipTable {ownTip} {otherTips} {match} {loading} {error} on:save={async ({detail}) => updateTip(detail)}/>
</div>
