<script lang="ts">
  import {leagueMap} from '../models/kicker/leagues';
  import {environment} from '../environments/environment.local';

  const hasLeagueOverview = Object
    .entries(leagueMap)
    .filter(([key, _]) => environment.leagues.includes(key))
    .length > 1

  export let segment: string;
</script>

<style type="text/scss">
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
                background-color: rgb(255, 62, 0);
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
        {#if hasLeagueOverview}
            <li>
                <a href="." aria-current="{segment === undefined ? 'page' : undefined}">
                    Wettbewerbe
                </a>
            </li>
        {/if}
        {#if  Object.keys(leagueMap).includes(segment)}
            <li>
                <a href="/{segment}/matches" aria-current="page">
                    {leagueMap[segment].name}
                </a>
            </li>
        {/if}
        <li>
            <a href="/auth/logout">
                logout
            </a>
        </li>
    </ul>
</nav>
