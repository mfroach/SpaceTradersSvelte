<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchWaypoint, fetchSystem, fetchShips, navigateShip } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';
    import WaypointSelector from '$lib/components/WaypointSelector.svelte';

    let waypoint = $state(null);
    let system = $state(null);
    let ships = $state([]);
    let systemSymbol = $derived($page.params.systemSymbol);
    let waypointSymbol = $derived($page.params.waypointSymbol);
    let shipsHere = $derived(ships.filter(s => s.nav?.waypointSymbol === waypoint?.symbol));
    let shipsInSystem = $derived(ships.filter(s => s.nav?.systemSymbol === systemSymbol && s.nav?.waypointSymbol !== waypoint?.symbol));
    let loading = $state(false);

    onMount(async () => {
        [waypoint, system, ships] = await Promise.all([
            fetchWaypoint(systemSymbol, waypointSymbol),
            fetchSystem(systemSymbol),
            fetchShips()
        ]);
    });

    function calculateFuelCost(ship: any): number {
        if (!waypoint || !ship.nav) return 0;
        const dx = waypoint.x - ship.nav.route.destination.x;
        const dy = waypoint.y - ship.nav.route.destination.y;
        const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
        return Math.max(1, distance);
    }

    async function handleNavigate(shipSymbol: string) {
        loading = true;
        try {
            await navigateShip(shipSymbol, waypoint.symbol);
            ships = await fetchShips();
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-4">
    {#if waypoint && system}
        <Breadcrumb items={[
            { label: 'Systems', href: '/systems' },
            { label: systemSymbol, href: `/systems/${systemSymbol}` },
            { label: waypoint.symbol }
        ]} />

        <div class="flex items-center gap-4 mb-4">
            <h1 class="text-2xl font-bold">{waypoint.symbol}</h1>
            <WaypointSelector waypoints={system.waypoints} currentWaypoint={waypoint.symbol} {systemSymbol} />
        </div>
        
        <div class="grid gap-4 mb-6">
            <div class="border p-4 rounded">
                <p>Type: {waypoint.type}</p>
                <p>System: <a href="/systems/{waypoint.systemSymbol}" class="text-blue-600 hover:underline">{waypoint.systemSymbol}</a></p>
                <p>Position: ({waypoint.x}, {waypoint.y})</p>
                {#if waypoint.orbits}
                    <p>Orbits: <a href="/systems/{systemSymbol}/waypoints/{waypoint.orbits}" class="text-blue-600 hover:underline">{waypoint.orbits}</a></p>
                {/if}
            </div>

            {#if shipsHere.length > 0}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Your Ships Here ({shipsHere.length})</h2>
                    {#each shipsHere as ship}
                        <a href="/ships/{ship.symbol}" class="block text-blue-600 hover:underline">
                            {ship.symbol} ({ship.nav.status})
                        </a>
                    {/each}
                </div>
            {/if}

            {#if shipsInSystem.length > 0}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Ships in System ({shipsInSystem.length})</h2>
                    {#each shipsInSystem as ship}
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <a href="/ships/{ship.symbol}" class="text-blue-600 hover:underline">
                                    {ship.symbol}
                                </a>
                                <span class="text-sm text-gray-600 ml-2">at {ship.nav.waypointSymbol}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-600">Fuel: {calculateFuelCost(ship)}</span>
                                <Button onclick={() => handleNavigate(ship.symbol)} disabled={loading || ship.nav.status !== 'IN_ORBIT'} class="text-xs px-2 py-1">
                                    Navigate
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if waypoint.traits?.length}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Traits</h2>
                    {#each waypoint.traits as trait}
                        <div class="mb-2">
                            <p class="font-medium">{trait.name}</p>
                            <p class="text-sm text-gray-600">{trait.description}</p>
                        </div>
                    {/each}
                </div>
            {/if}

            {#if waypoint.orbitals?.length}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Orbitals</h2>
                    {#each waypoint.orbitals as orbital}
                        <a href="/systems/{systemSymbol}/waypoints/{orbital.symbol}" class="block text-blue-600 hover:underline">
                            {orbital.symbol}
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="flex gap-2 flex-wrap">
            <a href="/systems/{systemSymbol}/waypoints/{waypointSymbol}/market">
                <Button>Market</Button>
            </a>
            <a href="/systems/{systemSymbol}/waypoints/{waypointSymbol}/shipyard">
                <Button>Shipyard</Button>
            </a>
            <a href="/systems/{systemSymbol}/waypoints/{waypointSymbol}/jump-gate">
                <Button>Jump Gate</Button>
            </a>
            <a href="/systems/{systemSymbol}/waypoints/{waypointSymbol}/construction">
                <Button>Construction</Button>
            </a>
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</div>