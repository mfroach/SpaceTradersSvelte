<script lang="ts">
	import type { SystemWaypoint } from '$lib/types';

	let { waypoints, currentWaypoint, systemSymbol }: { waypoints: SystemWaypoint[]; currentWaypoint: string; systemSymbol: string } = $props();

	function navigate(symbol: string) {
		window.location.href = `/systems/${systemSymbol}/waypoints/${symbol}`;
	}
</script>

<div class="inline-block">
	<select
		value={currentWaypoint}
		onchange={(e) => navigate(e.currentTarget.value)}
		class="border rounded px-3 py-2 text-sm"
	>
		{#each waypoints as waypoint}
			<option value={waypoint.symbol}>{waypoint.symbol} ({waypoint.type})</option>
		{/each}
	</select>
</div>
