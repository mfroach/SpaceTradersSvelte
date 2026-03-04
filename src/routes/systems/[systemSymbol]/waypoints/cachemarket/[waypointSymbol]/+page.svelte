<script lang="ts">
	import type { PageProps } from '../../../$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { fetchMarket } from '$lib/api';
	import { getCached, invalidateCache } from '$lib/cache.svelte';
	import { page } from '$app/state';
	let { data }: PageProps = $props();
	let systemSymbol: string = page.params.systemSymbol!;
	let waypointSymbol: string = page.params.waypointSymbol!;
	let cachedData = $state(null);
	
	async function refresh() {
		invalidateCache('market', systemSymbol, waypointSymbol);
		cachedData = await fetchMarket(systemSymbol, waypointSymbol);
	}
	
	$effect(() => {
		cachedData = getCached('market', systemSymbol, waypointSymbol);
	});
</script>

<Button onclick={refresh}>Refresh</Button>
<pre>{JSON.stringify(cachedData, null, 2)}</pre>