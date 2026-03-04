<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { fetchShip, shipAction, navigateShip } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    let ship = $state(null);
    let navTarget = $state('');
    let loading = $state(false);
    let extractTimer = $state<number | null>(null);
    let extracting = $state(false);
    let cooldownRemaining = $state(0);
    let cooldownInterval = $state<number | null>(null);

    onMount(async () => {
        const shipSymbol = $page.params.shipSymbol;
        ship = await fetchShip(shipSymbol);
    });

    onDestroy(() => {
        if (extractTimer) clearTimeout(extractTimer);
        if (cooldownInterval) clearInterval(cooldownInterval);
    });

    async function handleAction(action: string) {
        loading = true;
        try {
            await shipAction(ship.symbol, action);
            
            if (action === 'extract') {
                extracting = true;
                cooldownRemaining = 80;
                
                if (cooldownInterval) clearInterval(cooldownInterval);
                cooldownInterval = setInterval(() => {
                    cooldownRemaining--;
                    if (cooldownRemaining <= 0 && cooldownInterval) {
                        clearInterval(cooldownInterval);
                        cooldownInterval = null;
                    }
                }, 1000);
                
                extractTimer = setTimeout(() => handleAction('extract'), 80000);
            } else {
                ship = await fetchShip(ship.symbol);
            }
        } catch (e) {
            alert(`Error: ${e}`);
            if (extractTimer) {
                clearTimeout(extractTimer);
                extractTimer = null;
            }
            if (cooldownInterval) {
                clearInterval(cooldownInterval);
                cooldownInterval = null;
            }
            extracting = false;
        } finally {
            loading = false;
        }
    }

    function stopExtracting() {
        if (extractTimer) clearTimeout(extractTimer);
        if (cooldownInterval) clearInterval(cooldownInterval);
        extractTimer = null;
        cooldownInterval = null;
        extracting = false;
        cooldownRemaining = 0;
    }

    async function handleNavigate() {
        if (!navTarget) return;
        loading = true;
        try {
            const result = await navigateShip(ship.symbol, navTarget);
            console.log('Navigate result:', result);
            ship = await fetchShip(ship.symbol);
            navTarget = '';
        } catch (e) {
            console.error('Navigate error:', e);
            alert(`Error: ${e.message || e}`);
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-4">
    {#if ship}
        <Breadcrumb items={[
            { label: 'Ships', href: '/ships' },
            { label: ship.symbol }
        ]} />

        <h1 class="text-2xl font-bold mb-4">{ship.symbol}</h1>
        
        <div class="grid gap-4 mb-6">
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Navigation</h2>
                <p>Status: {ship.nav.status}</p>
                <p>Current Location: 
                    <a href="/systems/{ship.nav.systemSymbol}/waypoints/{ship.nav.waypointSymbol.split('-').pop()}" 
                       class="text-blue-600 hover:underline">
                        {ship.nav.waypointSymbol}
                    </a>
                </p>
                <p>Origin: {ship.nav.route.origin.symbol}</p>
                <p>Destination: 
                    <a href="/systems/{ship.nav.systemSymbol}/waypoints/{ship.nav.route.destination.symbol.split('-').pop()}" 
                       class="text-blue-600 hover:underline">
                        {ship.nav.route.destination.symbol}
                    </a>
                </p>
                <p>Departure: {new Date(ship.nav.route.departureTime).toLocaleString()}</p>
                <p>Arrival: {new Date(ship.nav.route.arrival).toLocaleString()}</p>
                <p>Flight Mode: {ship.nav.flightMode}</p>
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Configuration</h2>
                <p>Role: {ship.registration.role}</p>
                <p>Frame: {ship.frame.name} ({ship.frame.symbol})</p>
                <p>Reactor: {ship.reactor.name} - {ship.reactor.powerOutput} power</p>
                <p>Engine: {ship.engine.name} - Speed {ship.engine.speed}</p>
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Condition</h2>
                <p>Frame: {(ship.frame.condition * 100).toFixed(0)}% / {(ship.frame.integrity * 100).toFixed(0)}%</p>
                <p>Reactor: {(ship.reactor.condition * 100).toFixed(0)}% / {(ship.reactor.integrity * 100).toFixed(0)}%</p>
                <p>Engine: {(ship.engine.condition * 100).toFixed(0)}% / {(ship.engine.integrity * 100).toFixed(0)}%</p>
            </div>

            {#if ship.modules?.length}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Modules ({ship.modules.length})</h2>
                    {#each ship.modules as module}
                        <p class="text-sm">{module.name}</p>
                    {/each}
                </div>
            {/if}

            {#if ship.mounts?.length}
                <div class="border p-4 rounded">
                    <h2 class="font-semibold mb-2">Mounts ({ship.mounts.length})</h2>
                    {#each ship.mounts as mount}
                        <p class="text-sm">{mount.name} (Strength: {mount.strength})</p>
                    {/each}
                </div>
            {/if}

            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Fuel</h2>
                <p>{ship.fuel.current} / {ship.fuel.capacity}</p>
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Cargo ({ship.cargo.units} / {ship.cargo.capacity})</h2>
                {#each ship.cargo.inventory as item}
                    <p>{item.symbol}: {item.units}</p>
                {/each}
            </div>

            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Crew</h2>
                <p>{ship.crew.current} / {ship.crew.capacity} (Required: {ship.crew.required})</p>
                <p>Morale: {ship.crew.morale}</p>
            </div>
        </div>

        <div class="space-y-4">
            {#if extracting}
                <div class="border border-blue-500 bg-blue-50 p-4 rounded">
                    <p class="font-semibold text-blue-900">Auto-extracting...</p>
                    <p class="text-sm text-blue-700">Next extraction in: {cooldownRemaining}s</p>
                    <Button onclick={stopExtracting} class="mt-2">Stop Extracting</Button>
                </div>
            {/if}
            
            <div class="flex gap-2">
                <Button onclick={() => handleAction('orbit')} disabled={loading}>Orbit</Button>
                <Button onclick={() => handleAction('dock')} disabled={loading}>Dock</Button>
                <Button onclick={() => handleAction('extract')} disabled={loading || extracting}>Extract</Button>
                <Button onclick={() => handleAction('survey')} disabled={loading}>Survey</Button>
            </div>

            <div class="flex gap-2">
                <input bind:value={navTarget} placeholder="Waypoint (e.g., X1-FS25-B8)" class="border p-2 rounded flex-1" />
                <Button onclick={handleNavigate} disabled={loading || !navTarget}>Navigate</Button>
                <a href="/ships/{ship.symbol}/navigate">
                    <Button>Browse Waypoints</Button>
                </a>
                <a href="/ships/{ship.symbol}/route">
                    <Button>Route Planner</Button>
                </a>
            </div>
            {#if ship.nav.status === 'DOCKED'}
                <p class="text-sm text-amber-600">Ship must be in orbit to navigate</p>
            {/if}
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</div>
