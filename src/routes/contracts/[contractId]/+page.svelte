<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fetchContract, deliverContract, fulfillContract } from '$lib/api';
    import Button from '$lib/components/ui/button/button.svelte';

    let contract = $state(null);
    let contractId = $derived($page.params.contractId);
    let loading = $state(false);

    onMount(async () => {
        contract = await fetchContract(contractId);
    });

    async function handleDeliver(shipSymbol: string, tradeSymbol: string, units: number) {
        loading = true;
        try {
            await deliverContract(contractId, shipSymbol, tradeSymbol, units);
            contract = await fetchContract(contractId);
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }

    async function handleFulfill() {
        loading = true;
        try {
            await fulfillContract(contractId);
            contract = await fetchContract(contractId);
        } catch (e) {
            alert(`Error: ${e}`);
        } finally {
            loading = false;
        }
    }
</script>

{#if contract}
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Contract Details</h1>
        
        <div class="border p-4 rounded mb-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-gray-600">Type</p>
                    <p class="font-semibold">{contract.type}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Faction</p>
                    <p class="font-semibold">{contract.factionSymbol}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Status</p>
                    <p class="font-semibold">{contract.accepted ? (contract.fulfilled ? 'Fulfilled' : 'Accepted') : 'Pending'}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Deadline</p>
                    <p class="font-semibold">{new Date(contract.terms?.deadline).toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div class="border p-4 rounded mb-4">
            <h2 class="font-semibold mb-2">Payment</h2>
            <p>On Accept: {contract.terms?.payment?.onAccepted}</p>
            <p>On Fulfill: {contract.terms?.payment?.onFulfilled}</p>
        </div>

        {#if contract.terms?.deliver}
            <div class="border p-4 rounded mb-4">
                <h2 class="font-semibold mb-2">Deliverables</h2>
                {#each contract.terms.deliver as item}
                    <div class="mb-3 p-3 bg-gray-50 rounded">
                        <p class="font-medium">{item.tradeSymbol}</p>
                        <p class="text-sm">Progress: {item.unitsFulfilled}/{item.unitsRequired}</p>
                        <p class="text-sm">Destination: {item.destinationSymbol}</p>
                    </div>
                {/each}
            </div>
        {/if}

        {#if contract.accepted && !contract.fulfilled}
            <Button onclick={handleFulfill} disabled={loading}>Fulfill Contract</Button>
        {/if}
    </div>
{:else}
    <p>Loading...</p>
{/if}
