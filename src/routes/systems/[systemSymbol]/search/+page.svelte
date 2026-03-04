<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { searchWaypointsByTrait } from '$lib/api';
    import Breadcrumb from '$lib/components/Breadcrumb.svelte';

    let waypoints = $state([]);
    let systemSymbol = $derived($page.params.systemSymbol);
    let trait = $derived($page.url.searchParams.get('trait') || '');
    let loading = $state(true);

    onMount(async () => {
        if (trait) {
            try {
                waypoints = await searchWaypointsByTrait(systemSymbol, trait);
            } catch (e) {
                alert(`Error: ${e}`);
            }
        }
        loading = false;
    });
</script>

<div class="p-4">
    <Breadcrumb items={[
        { label: 'Systems', href: '/systems' },
        { label: systemSymbol, href: `/systems/${systemSymbol}` },
        { label: 'Search' }
    ]} />

    <h1 class="text-2xl font-bold mb-4">Waypoints with trait: {trait}</h1>

    {#if loading}
        <p>Loading...</p>
    {:else if waypoints.length === 0}
        <p class="text-gray-600">No waypoints found with trait "{trait}"</p>
    {:else}
        <div class="grid gap-2">
            {#each waypoints as waypoint}
                <a href="/systems/{systemSymbol}/waypoints/{waypoint.symbol.split('-').pop()}" 
                   class="border p-3 rounded hover:bg-gray-100">
                    <div class="font-medium">{waypoint.symbol}</div>
                    <div class="text-sm text-gray-600">{waypoint.type} | ({waypoint.x}, {waypoint.y})</div>
                    {#if waypoint.traits?.length}
                        <div class="text-xs text-gray-500 mt-1">
                            {waypoint.traits.map(t => t.name).join(', ')}
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    {/if}
</div>
