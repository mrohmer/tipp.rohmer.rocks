<script lang="ts">
  import {leagueMap} from '../models/kicker/maps';

  export let segment: string;
</script>

<style>
    nav {
        border-bottom: 1px solid rgba(255, 62, 0, 0.1);
        font-weight: 300;
        padding: 0 1em;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    /* clearfix */
    ul::after {
        content: '';
        display: block;
        clear: both;
    }

    li {
        display: block;
        float: left;
    }

    [aria-current] {
        position: relative;
        display: inline-block;
    }

    [aria-current]::after {
        position: absolute;
        content: '';
        width: calc(100% - 1em);
        height: 2px;
        background-color: rgb(255, 62, 0);
        display: block;
        bottom: -1px;
    }

    a {
        text-decoration: none;
        padding: 1em 0.5em;
        display: block;
    }
</style>

<nav>
    <ul>
        <li>
            <a href="." aria-current="{segment === undefined ? 'page' : undefined}">
                Wettbewerbsübersicht
            </a>
        </li>
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
