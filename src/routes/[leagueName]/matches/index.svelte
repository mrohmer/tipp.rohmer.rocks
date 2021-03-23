<script context="module" lang="ts">
  import type {LeagueInfo} from '../../../models/kicker/league-info';
  import type {Match} from '../../../models/kicker/match';
  import polka from 'polka';

  const getLeagueInfo = async (fetch: any, leagueName: string): Promise<LeagueInfo> => {
    const res = await fetch(`${leagueName}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw {status: res.status, message: data.message}
    }
  }
  const getMatches = async (fetch: any, leagueName: string, gamedayId?: string): Promise<Match[]> => {
    const res = await fetch(`${leagueName}/matches.json${gamedayId ? `?gamedayId=${gamedayId}` : ''}`);
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw {status: res.status, message: data.message}
    }
  }

  export async function preload({params, query}: polka.Request): Promise<{ leagueInfo: LeagueInfo, matches: Match[] }> {
    const {leagueName} = params;

    try {
      const matches = await getMatches(this.fetch.bind(this), leagueName, query?.gamedayId as string);
      const leagueInfo = await getLeagueInfo(this.fetch.bind(this), leagueName);
      return {matches, leagueInfo};
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  import {stores} from '@sapper/app';
  import MatchListItem from "../../../components/matches/MatchListItem.svelte";
  import Tip from "../../../components/matches/Tip.svelte";

  const {page} = stores();

  export let leagueInfo: LeagueInfo;
  export let matches: Match[];
  const dayOfWeekMap = {
    0: 'Sonntag',
    1: 'Montag',
    2: 'Dienstag',
    3: 'Mittwoch',
    4: 'Donnerstag',
    5: 'Freitag',
    6: 'Samstag',
  };

  function getMatchesByDate(ms: Match[]): { date: string, ms: Match[] }[] {
    const grouped = ms
      .sort((a, b) => a.date.localeCompare(b.date))
      .reduce(
        (prev, curr) => {
          const date = new Date(curr.date);
          const dateStr = `${dayOfWeekMap[date.getDay()]} ${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}.${date.getFullYear()}`;
          return {
            ...prev,
            [dateStr]: [
              ...(prev[dateStr] ?? []),
              curr,
            ]
          }
        },
        {} as Record<string, Match[]>
      )

    return Object.entries(grouped)
      .map(([date, ms]) => ({
        date,
        ms: ms as Match[],
      }));
  }

  $: gamedays = leagueInfo?.gamedays?.gameday ?? [];
  $: gamedayId = $page.query.gamedayId ?? leagueInfo?.currentRoundId;
  $: gamedayIndex = gamedays.findIndex(gd => gd.id === gamedayId);
  $: gameday = gamedayIndex !== undefined ? gamedays[gamedayIndex] : null;
  $: previousGamedayId = gamedayIndex !== undefined && gamedayIndex > 0 ? gamedays[gamedayIndex - 1].id : null;
  $: nextGamedayId = gamedayIndex !== undefined && gamedayIndex < gamedays.length - 1 ? gamedays[gamedayIndex + 1].id : null;
  $: matchesByDate = getMatchesByDate(matches);

</script>

<style type="text/scss">
  .gameday-nav {
    display: flex;

    &__link {
      width: 50px;
      text-align: center;
    }

    &__title {
      flex-grow: 1;
      text-align: center;
    }
  }

  .match-list-date {
    margin-bottom: 25px;
    &__headline {
      text-align: center;
    }
  }

  .match-list-link {
    text-decoration: none;
  }

  .match-item {
    margin-bottom: 20px;
  }
</style>

{#if gameday}
    <div class="gameday-nav">
        <div class="gameday-nav__link">
            {#if previousGamedayId}
                <a href="{$page.params.leagueName}/matches/?gamedayId={previousGamedayId}">prev</a>
            {/if}
        </div>
        <div class="gameday-nav__title">
            <h2>{gameday.title}</h2>
        </div>
        <div class="gameday-nav__link">
            {#if nextGamedayId}
                <a href="{$page.params.leagueName}/matches/?gamedayId={nextGamedayId}">next</a>
            {/if}
        </div>
    </div>
    {#each matchesByDate as {date, ms}}
        <div class="match-list-date">
            <h3 class="match-list-date__headline">
                {date}
            </h3>
            {#each ms as match}
                <div class="match-item">
                    <a href="{$page.params.leagueName}/match/{match.id}"
                       class="match-list-link"
                    >
                        <MatchListItem {match}/>
                    </a>
                    {#if match.homeTeam.id !== '0' && match.guestTeam.id !== '0'}
                        <Tip {match} leagueName={$page.params.leagueName}/>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
{/if}
