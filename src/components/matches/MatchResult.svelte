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
</script>
<style>
    .match-result {
        width: 60px;
        height: 40px;
        background-color: #333333;
        color: #fcfcfc;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
    }

    .match-result.match-result--big {
        width: 100px;
        height: 67px;
        font-size: 30px;
        line-height: 45px;
    }

    .match-result.match-result--running {
        color: #fad000;
    }

    .match-result.match-result--date {
        font-size: 16px;
        color: #d7d7d7;
    }

    .match-result.match-result--big.match-result--date {
        font-size: 28px;
        line-height: 67px;
    }

    .match-result__digit, .match-result__separator {
        display: inline-block;
    }

    .match-result__halftime {
        background-color: #585858;
        height: 22px;
        font-size: 15px;
        line-height: 21px;
        color: #d7d7d7;
    }
</style>
<div class="match-result"
     class:match-result--big="{size === 'big'}"
     class:match-result--date="{isBeforeMatch}"
     class:match-result--running={isInMatch}
     class:match-result--done={isAfterMatch}
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
            {match.results.hergEnde}
        </div>
        <div class="match-result__separator">
            :
        </div>
        <div class="match-result__digit">
            {match.results.aergEnde}
        </div>
        {#if size === 'big'}
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
</div>
