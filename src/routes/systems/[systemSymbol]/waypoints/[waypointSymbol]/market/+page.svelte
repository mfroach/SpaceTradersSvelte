<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fetchMarket, purchaseCargo, sellCargo, fetchShips } from '$lib/api';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let market = $state(null);
	let ships = $state([]);
	let selectedShip = $state('');
	let loading = $state(false);

	async function loadMarket() {
		const { systemSymbol, waypointSymbol } = $page.params;
		market = await fetchMarket(systemSymbol, waypointSymbol);
	}

	onMount(async () => {
		await loadMarket();
		ships = await fetchShips();
	});

	async function handlePurchase(tradeSymbol: string) {
		if (!selectedShip) { alert('Select a ship'); return; }
		const units = prompt('Units to purchase:');
		if (!units) return;
		loading = true;
		try {
			await purchaseCargo(selectedShip, tradeSymbol, parseInt(units));
			await loadMarket();
		} catch (e) {
			alert(`Error: ${e}`);
		} finally {
			loading = false;
		}
	}

	async function handleSell(tradeSymbol: string) {
		if (!selectedShip) { alert('Select a ship'); return; }
		const units = prompt('Units to sell:');
		if (!units) return;
		loading = true;
		try {
			await sellCargo(selectedShip, tradeSymbol, parseInt(units));
			await loadMarket();
		} catch (e) {
			alert(`Error: ${e}`);
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-4">
	{#if market}
		<h1 class="text-2xl font-bold mb-4">Market: {market.symbol}</h1>
		
		<div class="flex gap-2 mb-4">
			<select bind:value={selectedShip} class="border p-2 rounded">
				<option value="">Select Ship</option>
				{#each ships as ship}
					<option value={ship.symbol}>{ship.symbol}</option>
				{/each}
			</select>
			<Button onclick={loadMarket}>Refresh</Button>
		</div>

		<div class="mt-6">
			<Table.Root>
				<Table.Caption>Imports</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Symbol</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Description</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each market.imports || [] as item}
						<Table.Row>
							<Table.Cell>{item.symbol}</Table.Cell>
							<Table.Cell>{item.name}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="mt-6">
			<Table.Root>
				<Table.Caption>Exports</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Symbol</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Description</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each market.exports || [] as item}
						<Table.Row>
							<Table.Cell>{item.symbol}</Table.Cell>
							<Table.Cell>{item.name}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="mt-6">
			<h2 class="text-xl font-bold mb-2">Trade Goods ({market.tradeGoods?.length || 0})</h2>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Symbol</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Volume</Table.Head>
						<Table.Head>Supply</Table.Head>
						<Table.Head>Activity</Table.Head>
						<Table.Head>Buy</Table.Head>
						<Table.Head>Sell</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each market.tradeGoods || [] as item}
						<Table.Row>
							<Table.Cell>{item.symbol}</Table.Cell>
							<Table.Cell>{item.type}</Table.Cell>
							<Table.Cell>{item.tradeVolume}</Table.Cell>
							<Table.Cell>{item.supply}</Table.Cell>
							<Table.Cell>{item.activity}</Table.Cell>
							<Table.Cell>{item.purchasePrice}</Table.Cell>
							<Table.Cell>{item.sellPrice}</Table.Cell>
							<Table.Cell>
								<div class="flex gap-1">
									<button onclick={() => handlePurchase(item.symbol)} disabled={loading} class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">Buy</button>
									<button onclick={() => handleSell(item.symbol)} disabled={loading} class="px-2 py-1 text-xs border rounded hover:bg-gray-100 disabled:opacity-50">Sell</button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
