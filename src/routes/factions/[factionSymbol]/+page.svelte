<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchFaction } from '$lib/api';

    let faction = $state(null);
    let factionSymbol = $derived($page.params.factionSymbol);

    onMount(async () => {
        faction = await fetchFaction(factionSymbol);
    });
</script>

{#if faction}
    <div class="p-4">
        <h1 class="text-3xl font-bold mb-2">{faction.name}</h1>
        <p class="text-gray-600 mb-4">{faction.symbol}</p>
        
        <div class="border p-4 rounded mb-4">
            <h2 class="font-semibold mb-2">Description</h2>
            <p>{faction.description}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="border p-4 rounded">
                <h3 class="font-semibold mb-2">Headquarters</h3>
                <p>{faction.headquarters}</p>
            </div>
            
            {#if faction.traits}
                <div class="border p-4 rounded">
                    <h3 class="font-semibold mb-2">Traits</h3>
                    {#each faction.traits as trait}
                        <div class="mb-2">
                            <p class="font-medium">{trait.name}</p>
                            <p class="text-sm text-gray-600">{trait.description}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{:else}
    <p>Loading...</p>
{/if}
