<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchSystems } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let systems = $state([]);
    let page = $state(1);
    let limit = $state(20);

    onMount(async () => {
        systems = await fetchSystems(page, limit);
    });

    async function loadPage(newPage: number) {
        page = newPage;
        systems = await fetchSystems(page, limit);
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Systems</h1>
    
    <div class="grid gap-2">
        {#each systems as system}
            <a href="/systems/{system.symbol}" class="border p-3 rounded hover:bg-gray-50">
                <div class="font-semibold">{system.symbol}</div>
                <div class="text-sm text-gray-600">{system.type} - {system.x}, {system.y}</div>
            </a>
        {/each}
    </div>

    <div class="flex gap-2 mt-4">
        <Button onclick={() => loadPage(page - 1)} disabled={page <= 1}>Previous</Button>
        <span class="py-2">Page {page}</span>
        <Button onclick={() => loadPage(page + 1)}>Next</Button>
    </div>
</div>
