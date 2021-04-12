<script lang="ts">
  import Icon from "./Icon.svelte";
    export let linkLeft: string;
    export let tooltipLeft: string;
    export let tooltipRight: string;
    export let linkRight: string;
    export let hasHeader = true;
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
    <div class="header">
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
                    <Icon>arrow-right</Icon></a>
            {/if}
        </div>
    </div>
{/if}
<div class="content">
    <slot />
</div>
