<script lang="ts">
  import type {Match} from '../../models/kicker/match';
  import {Tip as TipModel} from '../../models/tip';
  import {Cached} from '../../decorators/cache';
  import Tip from "./Tip.svelte";
  import {updateTip as updateTipUtil} from '../../utils/update-tip';

  async function updateTip(data: TipModel) {
    loading = true;

    try {
      await updateTipUtil(leagueName, match, data);
      tip = data;
    } catch (e) {
      error = true;
      console.log(e);
    } finally {
      loading = false;
    }
  }

  @Cached('tip')
  async function fetchTip(url: string): Promise<TipModel> {
    if (typeof fetch === 'undefined') {
      return Promise.resolve(new TipModel());
    }
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return response.json();
      }
    } catch (e) {
    }
    return Promise.resolve(new TipModel());
  }

  async function getData(lN: string, matchId: string) {
    try {
      console.log('after update');
      tip = await fetchTip(`/${lN}/match/${matchId}/tip`)
    } catch (e) {
      console.log(e);
      error = true;
    } finally {
      loading = false;
    }
  }

  export let match: Match;
  export let leagueName: string;

  let tip: TipModel;
  let loading = true;
  let error = false;

  $: getData(leagueName, match.id)

</script>

<Tip hasHeader={true} editable={true} {loading} {error} {match} {tip} originalTip={tip && JSON.parse(JSON.stringify(tip))} on:save={async ({detail}) => updateTip(detail)} />
