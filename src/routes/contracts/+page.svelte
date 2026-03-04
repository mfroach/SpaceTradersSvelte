<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchContracts, acceptContract } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let contracts = $state([]);
    let loading = $state(false);

    onMount(async () => {
        contracts = await fetchContracts();
    });

    async function handleAccept(contractId: string) {
        loading = true;
        try {
            await acceptContract(contractId);
            contracts = await fetchContracts();
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Contracts</h1>
    
    <div class="grid gap-4">
        {#each contracts as contract}
            <div class="border p-4 rounded">
                <div class="flex justify-between items-start mb-2">
                    <h2 class="font-semibold">{contract.type}</h2>
                    <span class="text-sm px-2 py-1 rounded {contract.accepted ? 'bg-green-100' : 'bg-gray-100'}">
                        {contract.accepted ? 'Accepted' : 'Pending'}
                    </span>
                </div>
                
                <p class="text-sm text-gray-600 mb-2">Faction: {contract.factionSymbol}</p>
                
                <div class="mb-2">
                    <p class="text-sm">Payment: {contract.terms?.payment?.onAccepted} on accept, {contract.terms?.payment?.onFulfilled} on fulfill</p>
                    <p class="text-sm">Deadline: {new Date(contract.terms?.deadline).toLocaleString()}</p>
                </div>

                {#if contract.terms?.deliver}
                    <div class="mb-2">
                        <p class="text-sm font-medium">Deliverables:</p>
                        {#each contract.terms.deliver as item}
                            <p class="text-sm ml-2">{item.tradeSymbol}: {item.unitsFulfilled}/{item.unitsRequired} to {item.destinationSymbol}</p>
                        {/each}
                    </div>
                {/if}

                <div class="flex gap-2 mt-4">
                    {#if !contract.accepted}
                        <Button onclick={() => handleAccept(contract.id)} disabled={loading}>Accept</Button>
                    {/if}
                    <a href="/contracts/{contract.id}">
                        <Button variant="outline">Details</Button>
                    </a>
                </div>
            </div>
        {/each}
    </div>
</div>
