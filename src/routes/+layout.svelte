<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { fetchShips, fetchAgent, fetchContracts, shipAction as apiShipAction } from '$lib/api';

	let { children } = $props();
	let ships = $state([]);
	let agent = $state(null);
	let contracts = $state([]);

	onMount(async () => {
		[ships, agent, contracts] = await Promise.all([
			fetchShips(),
			fetchAgent(),
			fetchContracts()
		]);
	});

	function refreshData() {
		Promise.all([fetchShips(), fetchAgent(), fetchContracts()]).then(([s, a, c]) => {
			ships = s;
			agent = a;
			contracts = c;
		});
	}

	async function shipAction(shipSymbol: string, action: string) {
		try {
			await apiShipAction(shipSymbol, action);
			ships = await fetchShips();
		} catch (e) {
			alert(`${action} failed: ${e.message || e}`);
		}
	}

	setInterval(refreshData, 10000);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="flex h-screen gap-4 p-4">
	<!-- Left Column: Ships and Account -->
	<div class="w-80 flex flex-col gap-4">
		<!-- Ships Panel -->
		<div class="flex-1 border rounded-lg overflow-y-auto p-4 shadow">
			<h2 class="text-lg font-bold mb-3">Ships ({ships.length})</h2>
			<div class="space-y-2">
				{#each ships as ship}
					<div class="border rounded">
						<a href="/ships/{ship.symbol}" class="block p-3 hover:bg-gray-100">
							<div class="font-semibold text-sm">{ship.symbol}</div>
							<div class="text-xs text-gray-600">{ship.nav?.status}</div>
							<div class="text-xs text-gray-600">{ship.nav?.waypointSymbol}</div>
							<div class="text-xs text-gray-500">Fuel: {ship.fuel?.current}/{ship.fuel?.capacity}</div>
						</a>
						<div class="border-t p-2 flex gap-1 flex-wrap">
							<button onclick={() => shipAction(ship.symbol, 'orbit')} class="text-xs px-2 py-1 border rounded hover:bg-gray-100">Orbit</button>
							<button onclick={() => shipAction(ship.symbol, 'dock')} class="text-xs px-2 py-1 border rounded hover:bg-gray-100">Dock</button>
							<button onclick={() => shipAction(ship.symbol, 'extract')} class="text-xs px-2 py-1 border rounded hover:bg-gray-100">Extract</button>
							<button onclick={() => shipAction(ship.symbol, 'refuel')} class="text-xs px-2 py-1 border rounded hover:bg-gray-100">Refuel</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Account Panel -->
		<div class="border rounded-lg p-4 shadow">
			<h2 class="text-lg font-bold mb-3">Account</h2>
			{#if agent}
				<div class="border p-3 rounded mb-4">
					<div class="font-semibold">{agent.symbol}</div>
					<div class="text-sm text-gray-600">Credits: {agent.credits?.toLocaleString()}</div>
				</div>
			{/if}

			<h3 class="font-semibold mb-2 text-sm">Contracts ({contracts.length})</h3>
			<div class="space-y-2">
				{#each contracts as contract}
					<a href="/contracts/{contract.id}" class="block border p-2 rounded hover:bg-gray-100">
						<div class="text-xs font-medium">{contract.type}</div>
						<div class="text-xs text-gray-600">{contract.accepted ? 'Active' : 'Pending'}</div>
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<main class="flex-1 border rounded-lg overflow-y-auto shadow">
		{@render children?.()}
	</main>
</div>
