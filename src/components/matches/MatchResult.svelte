<script lang="ts">
  import type {Match} from '../../models/kicker/match';

  export let match: Match;
  export let size: 'small' | 'big' = 'small';

  function twoDigitStr(n: number): string {
    return n.toString().padStart(2, '0')
  }

  $: isBeforeMatch = !('results' in match)
  $: isInMatch = 'results' in match && match.completed === '0';
  $: isAfterMatch = 'results' in match && match.completed === '1';
  $: isAfterFirstHalftime = isAfterMatch && match.results.hergHz;
  $: isAfterExtension = isAfterMatch && match.results.hergVerl;
</script>
<style type="text/scss">
  .match-result {
    $this: &;

    width: 60px;
    height: 40px;
    background-color: #333333;
    color: #fcfcfc;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    display: inline-block;

    &--date {
      font-size: 16px;
      color: #d7d7d7;
    }

    &--big {
      width: 100px;
      height: 45px;
      font-size: 30px;
      line-height: 45px;

      &#{$this}--first-half-over {
        height: 67px;
      }

      &#{$this}--date {
        font-size: 28px;
        line-height: 45px;
      }
    }

    &--running {
      color: #fad000;
    }

    &__digit, &__separator {
      display: inline-block;
    }

    &__halftime, &__extension {
      background-color: #585858;
      height: 22px;
      font-size: 15px;
      line-height: 21px;
      color: #d7d7d7;
    }
  }
</style>
<div class="match-result"
     class:match-result--big="{size === 'big'}"
     class:match-result--date="{isBeforeMatch}"
     class:match-result--running={isInMatch}
     class:match-result--done={isAfterMatch}
     class:match-result--first-half-over={isAfterFirstHalftime}
>
    {#if isBeforeMatch}
        {#if match.timeConfirmed === '1'}
            {twoDigitStr(new Date(match.date).getHours())}:{twoDigitStr(new Date(match.date).getMinutes())}
        {:else}
            🤷
        {/if}
    {:else if isInMatch}
        <div class="match-result__digit">
            {match.results.hergAktuell}
        </div>
        <div class="match-result__separator">
            :
        </div>
        <div class="match-result__digit">
            {match.results.aergAktuell}
        </div>
    {:else}
        <div class="match-result__digit">
            {isAfterExtension ? match.results.hergVerl : match.results.hergEnde}
        </div>
        <div class="match-result__separator">
            :
        </div>
        <div class="match-result__digit">
            {isAfterExtension ? match.results.aergVerl : match.results.aergEnde}
        </div>
        {#if size === 'big' && isAfterFirstHalftime}
            {#if isAfterExtension}
                <div class="match-result__extension">
                    n.V.
                </div>
            {:else if isAfterFirstHalftime}
                <div class="match-result__halftime">
                    <div class="match-result__digit">
                        {match.results.hergHz}
                    </div>
                    <div class="match-result__separator">
                        :
                    </div>
                    <div class="match-result__digit">
                        {match.results.aergHz}
                    </div>
                </div>
            {/if}
        {/if}
    {/if}
</div>
