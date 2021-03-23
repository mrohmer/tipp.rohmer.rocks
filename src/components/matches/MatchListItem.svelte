<script lang="ts">
  import type {Match} from '../../models/kicker/match';
  import MatchResult from "./MatchResult.svelte";
  import {kickerImage} from "../../utils/kicker-image";

  export let match: Match;
</script>

<style>
    .match-list-item {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: space-between;
    }
    .match-list-item__team-name {
        text-align: left;
        width: calc(50% - 100px);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .match-list-item__team-name.match-list-item__team-name--home {
        text-align: right;
    }
    .match-list-item__logo {
        width: 30px;
        height: 30px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>

<div class="match-list-item">
    <div class="match-list-item__team-name match-list-item__team-name--home">
        {match.homeTeam.shortName}
    </div>
    {#if match.homeTeam.iconSmall}
        <div class="match-list-item__logo"
             style="background-image: url('{kickerImage(match.homeTeam.iconSmall)}')"></div>
    {/if}
    <MatchResult {match} />
    {#if match.guestTeam.iconSmall}
        <div class="match-list-item__logo"
             style="background-image: url('{kickerImage(match.guestTeam.iconSmall)}')"></div>
    {/if}
    <div class="match-list-item__team-name  match-list-item__team-name--guest">
        {match.guestTeam.shortName}
    </div>
</div>
