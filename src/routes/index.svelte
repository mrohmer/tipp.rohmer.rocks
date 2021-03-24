<script context="module" lang="ts">
	import {leagueMap} from '../models/kicker/leagues';
	import {environment} from '../environments/environment';

	export async function preload(page, session) {
		const leagues = Object
				.entries(leagueMap)
				.filter(([key, _]) => environment.leagues.includes(key))
				.map(([key, {name}]) => ({key, name}))

		if (leagues.length === 1) {
			return this.redirect(301, `/${leagues[0].key}/matches`);
		}
		return {leagues};
	}

</script>
<script lang="ts">
	export let leagues: Record<'key' | 'name', string>
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<h1>Recent posts</h1>

<ul>
	{#each leagues as league}
		<!-- we're using the non-standard `rel=prefetch` attribute to
                tell Sapper to load the data for the page as soon as
                the user hovers over the link or taps it, instead of
                waiting for the 'click' event -->
		<li>
			<a rel="prefetch" href="{league.key}/matches">
				{league.name}
			</a>
		</li>
	{/each}
</ul>
