<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let type: 'submit'|'button' = 'button';
  export let className: string;
  export let disabled = false;
  export let loading = false;
  export let style: string;

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
  @use "../../styles/variables" as var;
  button {
    height: var.$buttonHeight;
    border: none;
    background: #111;
    color: var.$primaryColor;
    outline: 0;
    cursor: pointer;
    &:focus, &:active {
     background: #222;
    }
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
</style>

<button {type} class="{className}" {disabled} {style} on:click>
    {#if loading}
        loading...
    {:else}
        <slot />
    {/if}
</button>
