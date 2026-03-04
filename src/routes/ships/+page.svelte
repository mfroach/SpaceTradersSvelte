<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchShips } from '$lib/api';
    
    let ships = $state([]);

    onMount(async () => {
        ships = await fetchShips();
    });
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Ships ({ships.length})</h1>
    
    <div class="grid gap-3">
        {#each ships as ship}
            <div class="border p-4 rounded hover:bg-gray-50">
                <div class="flex justify-between items-start mb-2">
                    <a href="/ships/{ship.symbol}" class="font-semibold text-lg hover:underline">
                        {ship.symbol}
                    </a>
                    <a href="/systems/{ship.nav?.systemSymbol}/waypoints/{ship.nav?.waypointSymbol?.split('-').pop()}" 
                       class="text-sm text-blue-600 hover:underline">
                        Go to location →
                    </a>
                </div>
                <div class="text-sm text-gray-600">
                    Status: {ship.nav?.status}
                </div>
                <div class="text-sm text-gray-600">
                    Location: <a href="/systems/{ship.nav?.systemSymbol}/waypoints/{ship.nav?.waypointSymbol?.split('-').pop()}" 
                                 class="text-blue-600 hover:underline">
                        {ship.nav?.waypointSymbol || 'Unknown'}
                    </a> in <a href="/systems/{ship.nav?.systemSymbol}" 
                               class="text-blue-600 hover:underline">
                        {ship.nav?.systemSymbol || 'Unknown'}
                    </a>
                </div>
                <div class="text-sm text-gray-600">
                    Fuel: {ship.fuel?.current}/{ship.fuel?.capacity} | Cargo: {ship.cargo?.units || 0}/{ship.cargo?.capacity || 0}
                </div>
            </div>
        {/each}
    </div>
</div>
