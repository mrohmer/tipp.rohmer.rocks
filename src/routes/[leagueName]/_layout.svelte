<script lang="ts">
  import {stores} from '@sapper/app';
  import SubNav from "../../components/SubNav.svelte";

  const {page} = stores();

  export let segment: string;
</script>

<SubNav>
    <li>
        <a href="{$page.params.leagueName}/matches" aria-current="{segment === 'matches' ? 'page' : undefined}">
            Spiele
        </a>
    </li>
    <li>
        <a href="{$page.params.leagueName}/standings" aria-current="{segment === 'standings' ? 'page' : undefined}">
            Rangliste
        </a>
    </li>
</SubNav>

<slot></slot>
