<script lang="ts">
  import {leagueMap} from '../models/kicker/leagues';
  import {environment} from '../environments/environment';
  import Icon from "./Icon.svelte";

  const leagueArray = Object
    .entries(leagueMap)
    .map(([key, value]) => ({key, value}))
    .filter(({key}) => environment.leagues.includes(key))
  ;


  export let segment: string;
  export let isAdmin = false;
</script>

<style type="text/scss">
  @use "../styles/variables" as var;

  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
    background: #111;
    color: #bbb;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;

    ul {
      margin: 0;
      padding: 0;
      display: flex;

      &::after {
        content: '';
        display: block;
        clear: both;
      }

      li {
        display: block;
        float: left;

        &.spacer {
          flex-grow: 2;
        }
        &.icon {
          padding: 0 0.25em;
        }

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
            {#if Object.keys(leagueMap).includes(segment)}
                <li>
                    <a href="/{segment}/matches" aria-current="page">
                        {leagueMap[segment].name}
                    </a>
                </li>
            {/if}
        {:else if leagueArray.length === 1}
            <li>
                <a href="/{leagueArray[0].key}/matches"
                   aria-current="{segment === leagueArray[0].key ? 'page' : undefined}">
                    {leagueArray[0].value.name}
                </a>
            </li>
        {/if}
        <li>
            <a href="/rules" aria-current="{segment === 'rules' ? 'page' : undefined}">
                Regeln
            </a>
        </li>
        <li class="spacer"></li>
        {#if isAdmin}
            <li class="icon">
                <a href="/users" aria-current="{segment === 'users' ? 'page' : undefined}">
                    <Icon>user</Icon>
                </a>
            </li>
        {/if}
        <li class="icon">
            <a href="/settings" aria-current="{segment === 'settings' ? 'page' : undefined}">
                <Icon>cog</Icon>
            </a>
        </li>
        <li class="icon">
            <a href="/auth/logout">
                <Icon>sign-out-alt</Icon>
            </a>
        </li>
    </ul>
</nav>
