<script lang="ts">
  export let id: string;
  export let type: 'toggle' | 'input';
</script>
<style type="text/scss">
  .settings-row {
    $this: &;

    display: flex;
    padding: 15px 10px;

    &__name {
      flex-grow: 2;
    }

    &--input {
      display: block;

      #{$this}__name {
        margin-bottom: 15px;
      }
    }
  }
</style>

<label class="settings-row" for="{id}"
       class:settings-row--toggle={type === 'toggle'}
       class:settings-row--input={type === 'input'}
>
    <div class="settings-row__name">
        <slot name="title"/>
    </div>
    <div class="settings-row__control">
        <slot name="control"/>
    </div>
</label>
