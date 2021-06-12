<script context="module" lang="ts">
	import {User} from '../models/user';

	async function getUser(): Promise<User> {
		const res = await this.fetch(`/auth/user`);
		const data = await res.json();

		if (res.status === 200) {
			return data;
		} else {
			throw {status: res.status, message: data.message}
		}
	}

	export async function preload(): Promise<{ isAdmin: boolean }> {
		try {
			const user: User = await getUser.call(this);

			console.log(user, user.roles?.includes('admin'));

			return {isAdmin: user.roles?.includes('admin')}
		} catch (e) {
			this.error(e.status, e.message);
		}
	}
</script>
<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import {stores} from '@sapper/app';
	const {session} = stores();

	export let segment: string;
	export let isAdmin = false;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background: black;
		padding: 2em;
		margin: 57px auto 0;
		box-sizing: border-box;
		color: #bbb;
		min-height: calc(100vh - 57px);
	}
</style>


<Nav {segment} {isAdmin}/>

<main>
	<slot></slot>
</main>
