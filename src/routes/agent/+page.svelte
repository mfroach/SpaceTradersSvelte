<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchAgent } from '$lib/api';
    
    let agent = $state(null);

    onMount(async () => {
        agent = await fetchAgent();
    });
</script>

<div class="p-4">
    {#if agent}
        <h1 class="text-2xl font-bold mb-4">{agent.symbol}</h1>
        <div class="grid gap-4">
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Account</h2>
                <p>Account ID: {agent.accountId}</p>
                <p>Headquarters: {agent.headquarters}</p>
            </div>
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Credits</h2>
                <p class="text-2xl font-bold">{agent.credits?.toLocaleString()}</p>
            </div>
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Starting Faction</h2>
                <p>{agent.startingFaction}</p>
            </div>
            <div class="border p-4 rounded">
                <h2 class="font-semibold mb-2">Ship Count</h2>
                <p>{agent.shipCount}</p>
            </div>
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</div>