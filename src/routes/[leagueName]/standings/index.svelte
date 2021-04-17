<script lang="ts" context="module">
  import polka from 'polka';
  import {StandingsByGroup} from '../../../models/user';

  async function getStandings(leagueName: string): Promise<StandingsByGroup[]> {
    const res = await this.fetch(`/${leagueName}/standings.json`);

    if (res.status === 200) {
      return await res.json();
    } else {
      throw {status: res.status};
    }
  }

  export async function preload({params, query}: polka.Request): Promise<{ standingsByGroups: StandingsByGroup[] }> {
    const {leagueName} = params;

    try {
      const standingsByGroups = await getStandings.call(this, leagueName);

      if (query.group && !standingsByGroups.find(group => group.id === query.group)) {
        this.error(404, 'GroupId not found');
        return;
      }

      return {standingsByGroups};
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  import SlideableNavigation from "../../../components/SlideableNavigation.svelte";
  import {stores} from '@sapper/app';

  export let standingsByGroups: StandingsByGroup[];
  const {page} = stores();

  $: index = standingsByGroups && $page.query.group ? standingsByGroups.findIndex(group => group.id === $page.query.group) : 0;
  $: standings = standingsByGroups ? standingsByGroups[index] : null;
  $: previousGroup = standingsByGroups && standingsByGroups.length && index > 0 ? standingsByGroups[index - 1] : null;
  $: nextGroup = standingsByGroups && (standingsByGroups.length - 1 > index) ? standingsByGroups[index + 1] : null;
</script>

<style type="text/scss">
  .standings {
    $this: &;

    &__col {
      padding: 5px 10px;

      &--position {
        padding-left: 5px;
        width: 35px;
        text-align: center;
        font-weight: bold;
      }

      &--name {
        flex-grow: 3;
      }

      &--points {
        padding-right: 5px;
        width: 55px;
        text-align: center;
      }
    }

    &__row {
      display: flex;

      &--header {
        border-bottom: 1px solid #1B1B1B;
        font-weight: bold;
      }

      &--self {
        background: #111;
        font-weight: bold;
      }
    }
  }
</style>

{#if !standings}
    loading...
{:else if index < 0}
    error... 😭
{:else }
    <SlideableNavigation hasHeader={standingsByGroups.length > 1}
                         linkLeft="{previousGroup ? `${$page.params.leagueName}/standings${previousGroup.id ? `?group=${previousGroup.id}` : ''}` : null}"
                         tooltipLeft="{previousGroup ? previousGroup.title : null}"
                         linkRight="{nextGroup ? `${$page.params.leagueName}/standings?group=${nextGroup.id}` : null}"
                         tooltipRight="{nextGroup ? nextGroup.title : null}"
    >
        <h2 slot="header">{standings.title}</h2>

        {#if standings.standings.length}
            <div className="standings">
                <div className="standings__row standings__row--header"
                >
                    <div className="standings__col standings__col--position">
                        Pos.
                    </div>
                    <div className="standings__col standings__col--name">
                        Name
                    </div>
                    <div className="standings__col standings__col--points">
                        Punkte
                    </div>
                </div>
                {#each standings.standings as item, i}
                    <div className="standings__row"
                         class:standings__row--self={item.self}
                    >
                        <div className="standings__col standings__col--position">
                            {i + 1}.
                        </div>
                        <div className="standings__col standings__col--name">
                            {item.username}
                        </div>
                        <div className="standings__col standings__col--points">
                            {item.points}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div style="text-align: center">
                Noch keine Ergebnisse verfügbar.
            </div>
        {/if}

    </SlideableNavigation>
{/if}
