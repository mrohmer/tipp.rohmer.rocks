<script lang="ts">
  import type {OthersTip, Tip as TipModel} from '../../models/tip';
  import Tip from "./Tip.svelte";
  import type {Match} from '../../models/kicker/match';
  import {createEventDispatcher} from 'svelte';

  export let match: Match
  export let ownTip: TipModel;
  export let otherTips: OthersTip[];
  export let loading = false;
  export let error = false;

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
    .tip-table {
      &__row {
        display: flex;
        margin-bottom: 10px;
      }
      &__col {
        $height: 40px;

        width: 50%;
        padding: 0 15px;
        height: $height;

        &--label {
          text-align: right;
          border-right: 1px solid #333;
          line-height: $height;
        }
        &--value {
          text-align: left;
          :global(.tip__content) {
            justify-content: left !important;
          }
        }
      }
    }
</style>

<div class="tip-table">
    <div class="tip-table__row">
        <div class="tip-table__col tip-table__col--label">
            Dein Tipp
        </div>
        <div class="tip-table__col tip-table__col--value">
            <Tip editable={true} hasHeader={false} tip={ownTip} {match} {loading} {error} originalTip={JSON.parse(JSON.stringify(ownTip))} on:save />
        </div>
    </div>
    {#each otherTips as ot}
        <div class="tip-table__row">
            <div class="tip-table__col tip-table__col--label">
                {ot.username}
            </div>
            <div class="tip-table__col tip-table__col--value">
                <Tip editable={false} hasHeader={false} tip={ot} anonymized={ot.anonymized} {match} />
            </div>
        </div>
    {/each}
</div>
