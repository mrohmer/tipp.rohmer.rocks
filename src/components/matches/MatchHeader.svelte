<script lang="ts">
  import type {Match} from '../../models/kicker/match';
  import MatchResult from "./MatchResult.svelte";
  import {kickerImage} from "../../utils/kicker-image";
  import type {Gameday} from '../../models/kicker/league-info';

  export let match: Match;
  export let gameday: Gameday;
</script>

<style>
    .match-header__gameday {
        text-align: center;
        font-size: 12px;
        color: #555555;
    }
    .match-header__result {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
    }
    .match-header__team {
        padding: 0 20px;
        text-align: center;
        width: 150px;
    }
    .match-header__logo {
        width: 50px;
        height: 50px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-block;
    }
</style>

<div class="match-header">
    {#if match.homeTeam.iconBig}
        <div class="match-header__gameday">
            {gameday.title}
        </div>
    {/if}
    <div class="match-header__result">
        <div class="match-header__team">
            {#if match.homeTeam.iconBig}
                <div class="match-header__logo"
                     style="background-image: url('{kickerImage(match.homeTeam.iconBig)}')"></div>
                <br>
            {/if}
            {match.homeTeam.shortName}
        </div>
        <MatchResult {match} size="big" />
        <div class="match-header__team">
            {#if match.guestTeam.iconBig}
                <div class="match-header__logo"
                     style="background-image: url('{kickerImage(match.guestTeam.iconBig)}')"></div>
                <br>
            {/if}
            {match.guestTeam.shortName}
        </div>
    </div>
</div>
