<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import Login from '../components/Login.svelte'
	import {stores} from '@sapper/app';
	import setPrototypeOf = Reflect.setPrototypeOf;
	const {session} = stores();

	export let segment: string;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background: black;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
		color: #bbb;
		min-height: calc(100vh - 57px);
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
