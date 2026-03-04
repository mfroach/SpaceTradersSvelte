<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchConstruction, supplyConstruction } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let construction = $state(null);
    let systemSymbol = $derived($page.params.systemSymbol);
    let waypointSymbol = $derived($page.params.waypointSymbol);
    let loading = $state(false);

    onMount(async () => {
        construction = await fetchConstruction(systemSymbol, waypointSymbol);
    });

    async function handleSupply(shipSymbol: string, tradeSymbol: string, units: number) {
        loading = true;
        try {
            await supplyConstruction(systemSymbol, waypointSymbol, shipSymbol, tradeSymbol, units);
            construction = await fetchConstruction(systemSymbol, waypointSymbol);
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

{#if construction}
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Construction Site - {systemSymbol}-{waypointSymbol}</h1>
        
        <div class="border p-4 rounded mb-4">
            <p class="text-sm text-gray-600">Status</p>
            <p class="font-semibold">{construction.isComplete ? 'Complete' : 'In Progress'}</p>
        </div>

        {#if construction.materials}
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Required Materials</h2>
                <div class="grid gap-2">
                    {#each construction.materials as material}
                        <div class="p-3 bg-gray-50 rounded">
                            <p class="font-medium">{material.tradeSymbol}</p>
                            <p class="text-sm">Progress: {material.fulfilled}/{material.required}</p>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{:else}
    <p>Loading...</p>
{/if}
