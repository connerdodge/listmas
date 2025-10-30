<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	type GiftItem = {
		id: string;
		name: string;
		url?: string;
		notes?: string;
		price?: string;
	};
	
	type ListData = {
		title: string;
		items: GiftItem[];
		owner: string;
		ownerName: string;
		createdAt: string;
		purchased: Record<string, { purchasedBy: string; purchasedAt: string }>;
	};
	
	let listData = $state<ListData | null>(null);
	let loading = $state(true);
	let notFound = $state(false);
	
	onMount(() => {
		// Load from localStorage (later we'll use a database)
		const stored = localStorage.getItem(`list-${data.listId}`);
		
		if (stored) {
			listData = JSON.parse(stored);
		} else {
			notFound = true;
		}
		
		loading = false;
	});
	
	function togglePurchased(itemId: string) {
		if (!listData) return;
		
		if (listData.purchased[itemId]) {
			// Unpurchase
			delete listData.purchased[itemId];
		} else {
			// Mark as purchased
			listData.purchased[itemId] = {
				purchasedBy: 'anonymous', // In production, use actual user
				purchasedAt: new Date().toISOString()
			};
		}
		
		// Save back to localStorage
		localStorage.setItem(`list-${data.listId}`, JSON.stringify(listData));
	}
	
	function isPurchased(itemId: string): boolean {
		return listData?.purchased[itemId] !== undefined;
	}
</script>

<svelte:head>
	<title>{listData?.title || 'Christmas List'} - Listmas</title>
</svelte:head>

{#if loading}
	<div class="loading-container">
		<Icon icon="mdi:loading" width="48" height="48" style="animation: spin 1s linear infinite; color: #ef4444;" />
		<p>Loading wishlist...</p>
	</div>
{:else if notFound}
	<div class="not-found-container">
		<Icon icon="mdi:gift-off" width="80" height="80" style="color: #9ca3af; margin-bottom: 1rem;" />
		<h1>List Not Found</h1>
		<p>This Christmas list doesn't exist or has been removed.</p>
		<a href="{base}/" class="btn-home">
			<Icon icon="mdi:home" width="20" height="20" />
			Go Home
		</a>
	</div>
{:else if listData}
	<div class="container">
		<div class="header">
			<div class="header-content">
				<Icon icon="mdi:gift" width="48" height="48" style="color: #ef4444;" />
				<div>
					<h1 class="list-title">{listData.title}</h1>
					<p class="list-owner">by {listData.ownerName}</p>
				</div>
			</div>
		</div>
		
		<div class="info-banner">
			<Icon icon="mdi:information" width="20" height="20" style="flex-shrink: 0; color: #3b82f6;" />
			<p>Click the checkbox to mark items as purchased. The list owner won't see which items are marked!</p>
		</div>
		
		<div class="items-section">
			{#if listData.items.length === 0}
				<div class="empty-state">
					<Icon icon="mdi:gift-outline" width="60" height="60" style="color: #9ca3af; margin-bottom: 0.5rem;" />
					<p>No items in this list yet.</p>
				</div>
			{:else}
				<div class="items-grid">
					{#each listData.items as item (item.id)}
						<div class="item-card" class:purchased={isPurchased(item.id)}>
							<div class="item-header">
								<div class="item-info">
									<h3 class="item-name">{item.name}</h3>
									{#if item.price}
										<span class="item-price">{item.price}</span>
									{/if}
								</div>
								<button 
									onclick={() => togglePurchased(item.id)}
									class="purchase-toggle"
									title={isPurchased(item.id) ? 'Mark as not purchased' : 'Mark as purchased'}
								>
									{#if isPurchased(item.id)}
										<Icon icon="mdi:check-circle" width="24" height="24" />
									{:else}
										<Icon icon="mdi:checkbox-blank-circle-outline" width="24" height="24" />
									{/if}
								</button>
							</div>
							
							{#if item.notes}
								<p class="item-notes">{item.notes}</p>
							{/if}
							
							{#if item.url}
								<a href={item.url} target="_blank" rel="noopener noreferrer" class="item-link">
									<Icon icon="mdi:link" width="16" height="16" />
									View Product
								</a>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.loading-container,
	.not-found-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
		text-align: center;
	}
	
	.not-found-container h1 {
		font-size: 2rem;
		color: #111827;
		margin: 0 0 0.5rem 0;
	}
	
	.not-found-container p {
		color: #6b7280;
		margin: 0 0 2rem 0;
	}
	
	.btn-home {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		border-radius: 0.5rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}
	
	.btn-home:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgb(239 68 68 / 0.4);
	}
	
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	
	.header {
		margin-bottom: 2rem;
	}
	
	.header-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.list-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #111827;
		margin: 0;
	}
	
	.list-owner {
		color: #6b7280;
		margin: 0.25rem 0 0 0;
		font-size: 1.125rem;
	}
	
	.info-banner {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: #eff6ff;
		border-radius: 0.75rem;
		border: 1px solid #bfdbfe;
		margin-bottom: 2rem;
	}
	
	.info-banner p {
		margin: 0;
		color: #1e40af;
		font-size: 0.875rem;
		line-height: 1.5;
	}
	
	.items-section {
		margin-top: 2rem;
	}
	
	.empty-state {
		text-align: center;
		padding: 3rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
	}
	
	.empty-state p {
		color: #6b7280;
		margin: 0;
	}
	
	.items-grid {
		display: grid;
		gap: 1rem;
	}
	
	.item-card {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
		transition: all 0.2s;
		border: 2px solid transparent;
	}
	
	.item-card:hover {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	
	.item-card.purchased {
		border-color: #16a34a;
		background: #f0fdf4;
	}
	
	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}
	
	.item-info {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	
	.item-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}
	
	.item-price {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		color: #92400e;
		padding: 0.25rem 0.625rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	
	.purchase-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem;
		color: #9ca3af;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.purchase-toggle:hover {
		color: #16a34a;
		transform: scale(1.1);
	}
	
	.item-card.purchased .purchase-toggle {
		color: #16a34a;
	}
	
	.item-notes {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0 0 0.75rem 0;
		line-height: 1.5;
	}
	
	.item-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: #2563eb;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s;
	}
	
	.item-link:hover {
		color: #1d4ed8;
		text-decoration: underline;
	}
	
	@media (max-width: 768px) {
		.list-title {
			font-size: 1.75rem;
		}
		
		.header-content {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
