<script lang="ts">
  import type {Match} from '../../models/kicker/match';
  import {createEventDispatcher} from 'svelte';
  import {Tip} from '../../models/tip';
  import Button from "../control/Button.svelte";

  export let match: Match;
  export let hasHeader = true;

  export let tip: Tip;
  export let originalTip: Tip;
  export let loading = false;
  export let error = false;
  export let editable = false;
  export let anonymized = false;

  const dispatch = createEventDispatcher();

  $: dirty = tip && originalTip && (tip.home !== originalTip.home || tip.guest !== originalTip.guest)

</script>

<style type="text/scss">
  .tip {
    $this: &;
    $backgroundColor: #181818;
    $height: 40px;

    &__headline {
      text-align: center;
      font-size: 10px;
      position: relative;
      color: #444;

      &:before, &:after {
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
      &:before {
        right: calc(50% + 12px);
      }
      &:after {
        left: calc(50% + 12px);
      }
    }

    &__content {
      &, & form {
        display: flex;
        justify-content: center;
      }
      line-height: $height;
    }
    &__number, &__separator {
      display: inline-block;
      vertical-align: bottom;
      background: $backgroundColor;
      color: white;
      font-size: 18px;
      text-align: center;
      height: $height;
      line-height: $height;
    }
    &__number {
      width: 28px;
      overflow: hidden;

      input {
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
    }
    &__separator {
      width: 4px;
    }
    :global(#{&}__submit) {
      margin-left: 5px;
      margin-right: -55px;
      width: 50px;
    }
    &--anonymized {
      #{$this}__content {
        width: 60px;
        background: $backgroundColor;
      }
      #{$this}__number {
        filter: blur(3px);
      }
    }
  }
</style>

<div class="tip"
     class:tip--loading={loading}
     class:tip--error={error}
     class:tip--tipable={!loading && !error && !('results' in match || !editable)}
     class:tip--over={!loading && !error && ('results' in match || !editable)}
     class:tip--anonymized={anonymized}
>
    {#if hasHeader}
        <div class="tip__headline">Tipp</div>
    {/if}
    <div class="tip__content">
        {#if loading}
            loading...
        {:else if error}
            error 😭
        {:else if 'results' in match || !editable}
            {#if tip.home === undefined}
                kein Tipp 🙈
            {:else}
                <div class="tip__number">
                    {anonymized ? 'X' : tip.home}
                </div>
                <div class="tip__separator">:</div>
                <div class="tip__number">
                    {anonymized ? 'X' : tip.guest}
                </div>
            {/if}
        {:else}
            <form on:submit={() => dispatch('save', tip)}>
                <div class="tip__number tip__number--input">
                    <input bind:value={tip.home} placeholder="-">
                </div>
                <div class="tip__separator">:</div>
                <div class="tip__number tip__number--input">
                    <input bind:value={tip.guest} placeholder="-">
                </div>
                {#if dirty}
                    <Button type="submit" className="tip__submit">save</Button>
                {/if}
            </form>
        {/if}
    </div>
</div>
