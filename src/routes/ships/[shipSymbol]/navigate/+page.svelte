<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchShip, fetchSystem, navigateShip } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    let ship = $state(null);
    let system = $state(null);
    let loading = $state(false);

    onMount(async () => {
        const shipSymbol = $page.params.shipSymbol;
        ship = await fetchShip(shipSymbol);
        system = await fetchSystem(ship.nav.systemSymbol);
    });

    function calculateFuelCost(waypoint: any): number {
        if (!ship) return 0;
        const dx = waypoint.x - ship.nav.route.destination.x;
        const dy = waypoint.y - ship.nav.route.destination.y;
        const distance = Math.round(Math.sqrt(dx * dx + dy * dy));
        return Math.max(1, distance);
    }

    function isInRange(waypoint: any): boolean {
        return calculateFuelCost(waypoint) <= ship.fuel.capacity;
    }

    async function handleNavigate(waypointSymbol: string) {
        loading = true;
        try {
            await navigateShip(ship.symbol, waypointSymbol);
            ship = await fetchShip(ship.symbol);
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-4">
    {#if ship && system}
        <Breadcrumb items={[
            { label: 'Ships', href: '/ships' },
            { label: ship.symbol, href: `/ships/${ship.symbol}` },
            { label: 'Navigate' }
        ]} />

        <h1 class="text-2xl font-bold mb-4">Navigate {ship.symbol}</h1>

        <div class="border p-4 rounded mb-4">
            <p>Current Location: {ship.nav.waypointSymbol}</p>
            <p>Fuel: {ship.fuel.current} / {ship.fuel.capacity}</p>
            <p>Status: {ship.nav.status}</p>
        </div>

        <h2 class="text-xl font-semibold mb-2">Waypoints in Range</h2>
        <div class="grid gap-2">
            {#each system.waypoints.filter(isInRange) as waypoint}
                {@const fuelCost = calculateFuelCost(waypoint)}
                {@const isCurrent = waypoint.symbol === ship.nav.waypointSymbol}
                <div class="border p-3 rounded flex items-center justify-between">
                    <div>
                        <div class="font-medium">{waypoint.symbol}</div>
                        <div class="text-sm text-gray-600">{waypoint.type} | ({waypoint.x}, {waypoint.y})</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="text-sm">Fuel: {fuelCost}</span>
                        <Button 
                            onclick={() => handleNavigate(waypoint.symbol)} 
                            disabled={loading || isCurrent || ship.nav.status !== 'IN_ORBIT'}
                        >
                            {isCurrent ? 'Current' : 'Navigate'}
                        </Button>
                    </div>
                </div>
            {/each}
        </div>

        {#if ship.nav.status === 'DOCKED'}
            <p class="text-sm text-amber-600 mt-4">Ship must be in orbit to navigate</p>
        {/if}
    {:else}
        <p>Loading...</p>
    {/if}
</div>
