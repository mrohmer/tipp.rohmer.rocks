<script lang="ts">
  import SettingsRow from "./SettingsRow.svelte";
  import Button from "../control/Button.svelte";
  import {createEventDispatcher} from 'svelte';
  import Input from "../control/Input.svelte";

  const dispatch = createEventDispatcher();

  export let value: string;
  export let loading = false;
  let currentValue = value;

  $: currentValue = value;
  $: changed = value?.trim() !== currentValue?.trim();

  const onSubmit = (event) => {
    event.preventDefault();
    value = currentValue?.trim();
    dispatch('submit', value);
  }
</script>

<form on:submit={onSubmit}>
    <SettingsRow id="control-username" type="input">
        <span slot="title">
            Anzeigename
        </span>
        <div slot="control">
            <Input type="text" id="control-username" bind:value={currentValue} style="width: calc(100% - 50px)" maxLength="50" minLength="3"/>
            <Button type="submit" disabled={!changed || value.length < 3 || value.length > 50} {loading} style="width: 45px">save</Button>
        </div>
    </SettingsRow>
</form>
