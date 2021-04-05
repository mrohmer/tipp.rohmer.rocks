<script lang="ts">
  import {leagueMap} from '../models/kicker/leagues';
  import {environment} from '../environments/environment';

  const leagueArray = Object
    .entries(leagueMap)
    .map(([key, value]) => ({key, value}))
    .filter(({key}) => environment.leagues.includes(key))
  ;



  export let segment: string;
</script>

<style type="text/scss">
  @use "../styles/variables" as var;
    nav {
        border-bottom: 1px solid rgba(255, 62, 0, 0.1);
        font-weight: 300;
        padding: 0 1em;
        background: #111;
        color: #bbb;
      ul {
        margin: 0;
        padding: 0;
        &::after {
          content: '';
          display: block;
          clear: both;
        }
        li {
          display: block;
          float: left;

          a {
            text-decoration: none;
            padding: 1em 0.5em;
            display: block;

            &[aria-current] {
              position: relative;
              display: inline-block;
              &::after {
                position: absolute;
                content: '';
                width: calc(100% - 1em);
                height: 2px;
                background-color: var.$primaryColor;
                display: block;
                bottom: -1px;
              }
            }
          }
        }
      }
    }
</style>

<nav>
    <ul>
        {#if leagueArray.length > 1}
            <li>
                <a href="." aria-current="{segment === undefined ? 'page' : undefined}">
                    Wettbewerbe
                </a>
            </li>
            {#if  Object.keys(leagueMap).includes(segment)}
                <li>
                    <a href="/{segment}/matches" aria-current="page">
                        {leagueMap[segment].name}
                    </a>
                </li>
            {/if}
        {:else if leagueArray.length === 1}
            <li>
                <a href="/{leagueArray[0].key}/matches" aria-current="{segment === leagueArray[0].key ? 'page' : undefined}">
                    {leagueArray[0].value.name}
                </a>
            </li>
        {/if}
        <li>
            <a href="/settings" aria-current="{segment === 'settings' ? 'page' : undefined}">
                Einstellungen
            </a>
        </li>
        <li>
            <a href="/auth/logout">
                logout
            </a>
        </li>
    </ul>
</nav>
