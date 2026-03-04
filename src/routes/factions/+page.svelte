<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchFactions } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let factions = $state([]);
    let page = $state(1);
    let limit = $state(20);

    onMount(async () => {
        factions = await fetchFactions(page, limit);
    });

    async function loadPage(newPage: number) {
        page = newPage;
        factions = await fetchFactions(page, limit);
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Factions</h1>
    
    <div class="grid gap-3">
        {#each factions as faction}
            <a href="/factions/{faction.symbol}" class="border p-4 rounded hover:bg-gray-50">
                <div class="font-semibold text-lg">{faction.name}</div>
                <div class="text-sm text-gray-600 mt-1">{faction.symbol}</div>
                <div class="text-sm mt-2">{faction.description}</div>
            </a>
        {/each}
    </div>

    <div class="flex gap-2 mt-4">
        <Button onclick={() => loadPage(page - 1)} disabled={page <= 1}>Previous</Button>
        <span class="py-2">Page {page}</span>
        <Button onclick={() => loadPage(page + 1)}>Next</Button>
    </div>
</div>
