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

<style>
    .tip__headline {
        text-align: center;
        font-size: 10px;
        position: relative;
        color: #444;
    }
    .tip__headline:before, .tip__headline:after {
        content: '';
        position: absolute;
        width: 30px;
        height: 1px;
        background: #444;
        max-width: calc(50% - 35px);
        top: 0;
        bottom: 0;
        margin-top: auto;
        margin-bottom: auto;
    }
    .tip__headline:before {
        right: calc(50% + 12px);
    }
    .tip__headline:after {
        left: calc(50% + 12px);
    }
    .tip__content {
        text-align: center;
    }
    .tip--tipable .tip__content,
    .tip--over .tip__content {
        font-size: 0;
    }
    .tip__number, .tip__separator {
        display: inline-block;
        vertical-align: bottom;
    }
    .tip__number, .tip__separator {
        background: #181818;
        color: white;
        font-size: 18px;
        text-align: center;
        height: 40px;
        line-height: 40px;
    }
    .tip__number {
        width: 28px;
    }
    .tip__separator {
        width: 4px;
    }
    .tip__number input {
        color: inherit;
        text-align: inherit;
        font-size: inherit;
        line-height: inherit;
        border: none;
        background: transparent;
        width: 100%;
        outline: 0;
        padding: 0;
    }
    .tip__submit {
        height: 40px;
        margin-left: 5px;
        margin-right: -55px;
        border: none;
        width: 50px;
        background: #111;
        color: rgb(255 62 0);
        outline: 0;
    }
    .tip__submit:focus, .tip__submit:active {
        background: #222;
    }
</style>

<div class="tip"
     class:tip--loading={loading}
     class:tip--error={error}
     class:tip--tipable={!loading && !error && !('results' in match)}
     class:tip--over={!loading && !error && 'results' in match}
>
    <div class="tip__headline">Tip</div>
    <div class="tip__content">
        {#if loading}
            loading...
        {:else if error}
            error 😭
        {:else if 'results' in match}
            {#if tip.home === null}
                kein tip<br>🙈
            {:else}
                <div class="tip__number">
                    {tip.home}
                </div>
                <div class="tip__separator">:</div>
                <div class="tip__number">
                    {tip.guest}
                </div>
            {/if}
        {:else}
            <form on:submit={async () => updateTip(tip)}>
                <div class="tip__number tip__number--input">
                    <input bind:value={tip.home}>
                </div>
                <div class="tip__separator">:</div>
                <div class="tip__number tip__number--input">
                    <input bind:value={tip.guest}>
                </div>
                <button type="submit" class="tip__submit">save</button>
            </form>
        {/if}
    </div>
</div>
