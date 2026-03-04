<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchJumpGate } from '$lib/api';

    let jumpGate = $state(null);
    let systemSymbol = $derived($page.params.systemSymbol);
    let waypointSymbol = $derived($page.params.waypointSymbol);

    onMount(async () => {
        jumpGate = await fetchJumpGate(systemSymbol, waypointSymbol);
    });
</script>

{#if jumpGate}
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Jump Gate - {systemSymbol}-{waypointSymbol}</h1>
        
        {#if jumpGate.connectedSystems}
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Connected Systems</h2>
                <div class="grid gap-2">
                    {#each jumpGate.connectedSystems as system}
                        <a href="/systems/{system.symbol}" class="p-2 bg-gray-50 rounded hover:bg-gray-100">
                            <p class="font-medium">{system.symbol}</p>
                            <p class="text-sm text-gray-600">{system.type} - Distance: {system.distance}</p>
                        </a>
                    {/each}
                </div>
            </div>
        {:else}
            <p>No connected systems</p>
        {/if}
    </div>
{:else}
    <p>Loading...</p>
{/if}
