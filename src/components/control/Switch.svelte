<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let checked = false;
  export let id: string;
  export let disabled = false;

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
  @use "../../styles/variables" as var;

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: var.$primaryColor;
        box-shadow: 0 0 1px var.$primaryColor;

        &:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
      }
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      border-radius: 34px;

      &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 50%;
      }
    }


    &--disabled {
      opacity: 0.5;
    }
  }
</style>

<label class="switch" for="{id}" class:switch--disabled={disabled}>
    <input type="checkbox" bind:checked on:change {id} {disabled}/>
    <span class="slider"/>
</label>
