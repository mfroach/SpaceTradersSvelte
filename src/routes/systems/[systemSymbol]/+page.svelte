<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchSystem, fetchShips } from '$lib/api';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    let system = $state(null);
    let ships = $state([]);
    let shipsInSystem = $derived(ships.filter(s => s.nav?.systemSymbol === system?.symbol));

    onMount(async () => {
        const systemSymbol = $page.params.systemSymbol;
        [system, ships] = await Promise.all([fetchSystem(systemSymbol), fetchShips()]);
    });
</script>

<div class="p-4">
    {#if system}
        <Breadcrumb items={[
            { label: 'Systems', href: '/systems' },
            { label: system.symbol }
        ]} />

        <h1 class="text-2xl font-bold mb-4">{system.symbol}</h1>
        
        <div class="mb-4">
            <p>Type: {system.type}</p>
            <p>Sector: {system.sectorSymbol}</p>
        </div>

        {#if shipsInSystem.length > 0}
            <div class="mb-6 border p-4 rounded">
                <h2 class="text-lg font-semibold mb-2">Your Ships Here ({shipsInSystem.length})</h2>
                <div class="grid gap-2">
                    {#each shipsInSystem as ship}
                        <a href="/ships/{ship.symbol}" class="text-blue-600 hover:underline">
                            {ship.symbol} - {ship.nav?.waypointSymbol}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        <h2 class="text-xl font-semibold mb-2">Waypoints ({system.waypoints?.length || 0})</h2>
        
        <div class="mb-4 flex gap-2">
            <input 
                type="text" 
                placeholder="Search by trait (e.g., MARKETPLACE)" 
                class="border p-2 rounded flex-1"
                onkeydown={(e) => e.key === 'Enter' && e.target.value && (window.location.href = `/systems/${system.symbol}/search?trait=${e.target.value}`)}
            />
        </div>

        <div class="grid gap-2">
            {#each system.waypoints || [] as waypoint}
                <a href="/systems/{system.symbol}/waypoints/{waypoint.symbol.split('-').pop()}" 
                   class="border p-3 rounded hover:bg-gray-100">
                    <div class="font-medium">{waypoint.symbol}</div>
                    <div class="text-sm text-gray-600">{waypoint.type} | ({waypoint.x}, {waypoint.y})</div>
                </a>
            {/each}
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</div>