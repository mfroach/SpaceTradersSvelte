<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchShipyard, purchaseShip } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let shipyard = $state(null);
    let systemSymbol = $derived($page.params.systemSymbol);
    let waypointSymbol = $derived($page.params.waypointSymbol);
    let loading = $state(false);

    onMount(async () => {
        shipyard = await fetchShipyard(systemSymbol, waypointSymbol);
    });

    async function handlePurchase(shipType: string) {
        loading = true;
        try {
            await purchaseShip(shipType, `${systemSymbol}-${waypointSymbol}`);
            alert('Ship purchased!');
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

{#if shipyard}
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Shipyard - {systemSymbol}-{waypointSymbol}</h1>
        
        {#if shipyard.ships}
            <div class="grid gap-4">
                {#each shipyard.ships as ship}
                    <div class="border p-4 rounded">
                        <h2 class="font-semibold text-lg">{ship.name}</h2>
                        <p class="text-sm text-gray-600 mb-2">{ship.type}</p>
                        <p class="mb-2">Price: {ship.purchasePrice}</p>
                        <Button onclick={() => handlePurchase(ship.type)} disabled={loading}>Purchase</Button>
                    </div>
                {/each}
            </div>
        {:else}
            <p>No ships available</p>
        {/if}
    </div>
{:else}
    <p>Loading...</p>
{/if}
