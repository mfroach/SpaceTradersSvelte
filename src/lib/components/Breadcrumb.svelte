<script lang="ts">
	type BreadcrumbItem = { label: string; href?: string };
	let { items }: { items: BreadcrumbItem[] } = $props();
</script>

<nav class="flex items-center gap-2 text-sm text-gray-600 mb-4">
	{#each items as item, i}
		{#if i > 0}
			<span>/</span>
		{/if}
		{#if item.href}
			<a href={item.href} class="hover:text-gray-900 hover:underline">{item.label}</a>
		{:else}
			<span class="text-gray-900 font-medium">{item.label}</span>
		{/if}
	{/each}
</nav>
