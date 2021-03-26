<script lang="ts">
  export let id: string;
  export let type: 'toggle' = 'toggle';
</script>
<style type="text/scss">
  .settings-row {
    display: flex;

    &__name {
      flex-grow: 2;
    }
  }
</style>

<label class="settings-row" for="{id}" class:settings-row--toggle={type === 'toggle'}>
    <div class="settings-row__name">
        <slot name="title"/>
    </div>
    <div class="settings-row__control">
        <slot name="control"/>
    </div>
</label>
