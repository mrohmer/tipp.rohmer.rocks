<script lang="ts" context="module">
  import polka from 'polka';
  import type {Standings} from '../../../models/user';

  async function getStandings(leagueName: string): Promise<Standings> {
    const res = await this.fetch(`/${leagueName}/standings.json`);

    if (res.status === 200) {
      return await res.json();
    } else {
      throw {status: res.status};
    }
  }

  export async function preload({params}: polka.Request): Promise<{ standings: Standings }> {
    const {leagueName} = params;

    try {
      const standings = await getStandings.call(this, leagueName);
      return {standings};
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  export let standings: Standings;
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

<div class="standings">

    <div class="standings__row standings__row--header"
    >
        <div class="standings__col standings__col--position">
            Pos.
        </div>
        <div class="standings__col standings__col--name">
            Name
        </div>
        <div class="standings__col standings__col--points">
            Punkte
        </div>
    </div>
    {#each standings as item, i}
        <div class="standings__row"
             class:standings__row--self={item.self}
        >
            <div class="standings__col standings__col--position">
                {i + 1}.
            </div>
            <div class="standings__col standings__col--name">
                {item.username}
            </div>
            <div class="standings__col standings__col--points">
                {item.points}
            </div>
        </div>
    {/each}
</div>
