<script lang="ts">
  import Icon from "./Icon.svelte";
  import { goto } from "@sapper/app";

  const swipe = async (node: HTMLElement) => {
    if (typeof window === 'undefined') {
      return;
    }
    const events: Array<string> = [
      'swipe',
      'swipeleft',
      'swiperight',
      'swipeup',
      'swipedown'
    ];
    const Hammer = await import('hammerjs');

    const hammer = new Hammer.default(node);
    for (const event of events) {
      hammer.on(event, (ev: any) => node.dispatchEvent(new CustomEvent(event, { detail: ev })));
    }
  }

  export let linkLeft: string;
  export let tooltipLeft: string;
  export let tooltipRight: string;
  export let linkRight: string;
  export let hasHeader = true;

  function swipeLeft() {
    if (linkRight) {
      goto(linkRight, {});
    }
  }

  function swipeRight() {
    if (linkLeft) {
      goto(linkLeft, {});
    }
  }
</script>

<style type="text/scss">
  .header {
    display: flex;

    &__link {
      width: 50px;
      text-align: center;

      a {
        display: block;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
      }
    }

    &__title {
      flex-grow: 1;
      text-align: center;
    }
  }
</style>
{#if hasHeader}
    <div class="header" use:swipe on:swipeleft={swipeLeft} on:swiperight={swipeRight}>
        <div class="header__link">
            {#if linkLeft}
                <a href="{linkLeft}" title="{tooltipLeft}">
                    <Icon>arrow-left</Icon>
                </a>
            {/if}
        </div>
        <div class="header__title">
            <slot name="header"/>
        </div>
        <div class="header__link">
            {#if linkRight}
                <a href="{linkRight}" title="{tooltipRight}">
                    <Icon>arrow-right</Icon>
                </a>
            {/if}
        </div>
    </div>
{/if}
<div class="content" use:swipe on:swipeleft={swipeLeft} on:swiperight={swipeRight}>
    <slot/>
</div>
