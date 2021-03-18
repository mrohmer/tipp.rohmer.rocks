<script lang="ts">
  import type {Match} from '../../models/kicker/match';
  import {afterUpdate, onMount} from 'svelte';
  import {Tip} from '../../models/tip';
  import {Cached} from '../../decorators/cache';

  async function updateTip(data: Tip): Promise<Tip> {
    loading = true;

    try {
      await fetch(`/${leagueName}/match/${match.id}/tip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({home: tip.home, guest: tip.guest}),
      });
    } catch (e) {
      error = true;
      console.log(e);
    } finally {
      loading = false;
    }
  }
  @Cached('tip')
  async function fetchTip(url: string): Promise<Tip> {
    if (typeof fetch === 'undefined') {
      return Promise.resolve(new Tip());
    }
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return response.json();
      }
    } catch (e) {
    }
    return Promise.resolve(new Tip());
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

  let tip: Tip;
  let loading = true;
  let error = false;

  $: getData(leagueName, match.id)

</script>

{#if loading}
    loading...
{:else if error}
    error 😭
{:else if 'results' in match}
    {#if tip.home === null}
        kein tip 🙈
    {:else}
        {tip.home}:{tip.guest}
    {/if}
{:else}
    <form class="tip" on:submit={async () => updateTip(tip)}>
        <div class="tip__inputs">
            <input bind:value={tip.home}>
            :
            <input bind:value={tip.guest}>
        </div>
        <button type="submit">save</button>
    </form>
{/if}
