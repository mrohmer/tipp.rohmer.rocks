<script lang="ts">
	import {leagueMap} from '../models/kicker/maps';

	const leagues = Object
			.entries(leagueMap)
			.map(([key, {name}]) => ({key, name}))
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
