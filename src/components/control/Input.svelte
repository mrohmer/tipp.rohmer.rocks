<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  export let value = false;
  export let id: string;
  export let name: string;
  export let disabled = false;
  export let type: 'text' | 'number' | 'email' = 'text';
  export let style: string;
  export let max: number;
  export let min: number;
  export let maxLength: number;
  export let minLength: number;

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
  @use "../../styles/variables" as var;

  input {
    height: var.$inputHeight;
    box-sizing: border-box;
    padding: 5px 10px;
    outline: 0;
    border: 1px solid transparent;

    &:focus, &:active {
      border-color: var.$primaryColor;
    }
  }
</style>

<input on:input={(e) => (value = e.target.value) && dispatch('input', value)}
       on:change={(e) => (value = e.target.value) && dispatch('change', value)}
       value={value}
       {disabled}
       {type}
       {id}
       {name}
       {style}
       {max}
       {min}
       {maxLength}
       {minLength}
/>
