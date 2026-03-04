<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchShip, fetchSystem, navigateShip, shipAction } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    let ship = $state(null);
    let system = $state(null);
    let targetWaypoint = $state('');
    let route = $state([]);
    let loading = $state(false);
    let executing = $state(false);
    let currentStep = $state(0);

    onMount(async () => {
        const shipSymbol = $page.params.shipSymbol;
        ship = await fetchShip(shipSymbol);
        system = await fetchSystem(ship.nav.systemSymbol);
    });

    function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.round(Math.sqrt(dx * dx + dy * dy));
    }

    function findRefuelStops() {
        if (!targetWaypoint || !ship || !system) return;
        
        const target = system.waypoints.find(w => w.symbol === targetWaypoint);
        if (!target) {
            alert('Waypoint not found');
            return;
        }

        const fuelStations = system.waypoints.filter(w => w.type === 'FUEL_STATION');
        const currentPos = { x: ship.nav.route.destination.x, y: ship.nav.route.destination.y };
        const maxRange = ship.fuel.capacity;
        
        const path = [];
        let pos = currentPos;
        
        while (true) {
            const distToTarget = calculateDistance(pos.x, pos.y, target.x, target.y);
            
            if (distToTarget <= maxRange) {
                path.push({ waypoint: target.symbol, type: 'navigate', fuel: distToTarget });
                break;
            }
            
            const reachableStations = fuelStations
                .filter(fs => calculateDistance(pos.x, pos.y, fs.x, fs.y) <= maxRange)
                .map(fs => ({
                    station: fs,
                    distToStation: calculateDistance(pos.x, pos.y, fs.x, fs.y),
                    distToTarget: calculateDistance(fs.x, fs.y, target.x, target.y)
                }))
                .sort((a, b) => a.distToTarget - b.distToTarget);
            
            if (reachableStations.length === 0) {
                alert('No route found - target is unreachable');
                return;
            }
            
            const next = reachableStations[0];
            path.push({ waypoint: next.station.symbol, type: 'navigate', fuel: next.distToStation });
            path.push({ waypoint: next.station.symbol, type: 'dock' });
            path.push({ waypoint: next.station.symbol, type: 'refuel' });
            path.push({ waypoint: next.station.symbol, type: 'orbit' });
            pos = { x: next.station.x, y: next.station.y };
        }
        
        route = path;
    }

    async function executeRoute() {
        executing = true;
        currentStep = 0;
        
        try {
            for (let i = 0; i < route.length; i++) {
                currentStep = i;
                const step = route[i];
                
                if (step.type === 'navigate') {
                    await navigateShip(ship.symbol, step.waypoint);
                } else {
                    await shipAction(ship.symbol, step.type);
                }
                
                ship = await fetchShip(ship.symbol);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            alert('Route completed!');
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            executing = false;
        }
    }
</script>

<div class="p-4">
    {#if ship && system}
        <Breadcrumb items={[
            { label: 'Ships', href: '/ships' },
            { label: ship.symbol, href: `/ships/${ship.symbol}` },
            { label: 'Route Planner' }
        ]} />

        <h1 class="text-2xl font-bold mb-4">Route Planner - {ship.symbol}</h1>

        <div class="border p-4 rounded mb-4">
            <p>Current Location: {ship.nav.waypointSymbol}</p>
            <p>Fuel: {ship.fuel.current} / {ship.fuel.capacity}</p>
            <p>Max Range: {ship.fuel.capacity} units</p>
        </div>

        <div class="mb-4">
            <label class="block mb-2 font-semibold">Target Waypoint</label>
            <div class="flex gap-2">
                <select bind:value={targetWaypoint} class="border p-2 rounded flex-1">
                    <option value="">Select waypoint...</option>
                    {#each system.waypoints as waypoint}
                        <option value={waypoint.symbol}>{waypoint.symbol} ({waypoint.type})</option>
                    {/each}
                </select>
                <Button onclick={findRefuelStops} disabled={!targetWaypoint || loading}>Calculate Route</Button>
            </div>
        </div>

        {#if route.length > 0}
            <div class="border p-4 rounded mb-4">
                <h2 class="font-semibold mb-2">Planned Route ({route.length} steps)</h2>
                <div class="space-y-1">
                    {#each route as step, i}
                        <div class="text-sm flex items-center gap-2" class:font-bold={executing && i === currentStep}>
                            <span class="text-gray-500">{i + 1}.</span>
                            {#if step.type === 'navigate'}
                                <span>Navigate to {step.waypoint} (Fuel: {step.fuel})</span>
                            {:else}
                                <span>{step.type.toUpperCase()}</span>
                            {/if}
                            {#if executing && i === currentStep}
                                <span class="text-blue-600">← Executing</span>
                            {/if}
                        </div>
                    {/each}
                </div>
                <Button onclick={executeRoute} disabled={executing} class="mt-4">
                    {executing ? 'Executing...' : 'Execute Route'}
                </Button>
            </div>
        {/if}
    {:else}
        <p>Loading...</p>
    {/if}
</div>
