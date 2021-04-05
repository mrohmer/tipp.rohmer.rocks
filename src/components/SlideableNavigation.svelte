<script lang="ts">
    export let linkLeft: string;
    export let linkRight: string;
</script>

<style type="text/scss">
    .header {
      display: flex;

      &__link {
        width: 50px;
        text-align: center;
      }

      &__title {
        flex-grow: 1;
        text-align: center;
      }
    }
</style>
<div class="header">
    <div class="header__link">
        {#if linkLeft}
            <a href="{linkLeft}">prev</a>
        {/if}
    </div>
    <div class="header__title">
        <slot name="header" />
    </div>
    <div class="header__link">
        {#if linkRight}
            <a href="{linkRight}">next</a>
        {/if}
    </div>
</div>
<div class="content">
    <slot />
</div>
