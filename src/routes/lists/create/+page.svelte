<script lang="ts">
	import type { PageData } from './$types';
	import ListItem from '$lib/components/ListItem.svelte';
	import Icon from '@iconify/svelte';
	
	let { data }: { data: PageData } = $props();
	
	type GiftItem = {
		id: string;
		name: string;
		url?: string;
		notes?: string;
		price?: string;
	};
	
	let listTitle = $state('My Christmas Wishlist 2025');
	let items = $state<GiftItem[]>([]);
	let newItemName = $state('');
	let newItemUrl = $state('');
	let newItemNotes = $state('');
	let newItemPrice = $state('');
	let shareableLink = $state<string | null>(null);
	let showShareModal = $state(false);
	
	function addItem() {
		if (!newItemName.trim()) return;
		
		const item: GiftItem = {
			id: crypto.randomUUID(),
			name: newItemName.trim(),
			url: newItemUrl.trim() || undefined,
			notes: newItemNotes.trim() || undefined,
			price: newItemPrice.trim() || undefined
		};
		
		items = [...items, item];
		
		// Reset form
		newItemName = '';
		newItemUrl = '';
		newItemNotes = '';
		newItemPrice = '';
	}
	
	function removeItem(id: string) {
		items = items.filter(item => item.id !== id);
	}
	
	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			addItem();
		}
	}
	
	function saveList() {
		const listData = {
			title: listTitle,
			items,
			owner: data.user.email,
			ownerName: data.user.name,
			createdAt: new Date().toISOString(),
			purchased: {} // Track purchased items { itemId: { purchasedBy: email, purchasedAt: timestamp } }
		};
		
		// For now, save to localStorage (later we'll use a database)
		const listId = crypto.randomUUID();
		localStorage.setItem(`list-${listId}`, JSON.stringify(listData));
		
		// Generate shareable link
		const baseUrl = window.location.origin;
		shareableLink = `${baseUrl}/listmas/lists/${listId}`;
		showShareModal = true;
	}
	
	function copyLink() {
		if (shareableLink) {
			navigator.clipboard.writeText(shareableLink);
			alert('Link copied to clipboard!');
		}
	}
	
	function closeModal() {
		showShareModal = false;
	}
</script>

<svelte:head>
	<title>Create Your Christmas List - Listmas</title>
</svelte:head>

<div class="container">
	<div class="header-section">
		<input 
			type="text" 
			bind:value={listTitle}
			class="list-title-input"
			placeholder="My Christmas Wishlist"
		/>
		<p class="subtitle">Add your gift wishes below</p>
	</div>
	
	<div class="add-item-section">
		<h2 class="section-title">Add New Item</h2>
		<div class="form-grid">
			<div class="form-group">
				<label for="item-name">Gift Name *</label>
				<input 
					id="item-name"
					type="text" 
					bind:value={newItemName}
					onkeypress={handleKeyPress}
					placeholder="e.g., Nintendo Switch"
					class="input"
				/>
			</div>
			
			<div class="form-group">
				<label for="item-url">Link (optional)</label>
				<input 
					id="item-url"
					type="url" 
					bind:value={newItemUrl}
					onkeypress={handleKeyPress}
					placeholder="https://amazon.com/..."
					class="input"
				/>
			</div>
			
			<div class="form-group">
				<label for="item-price">Price (optional)</label>
				<input 
					id="item-price"
					type="text" 
					bind:value={newItemPrice}
					onkeypress={handleKeyPress}
					placeholder="$50"
					class="input"
				/>
			</div>
			
			<div class="form-group full-width">
				<label for="item-notes">Notes (optional)</label>
				<textarea 
					id="item-notes"
					bind:value={newItemNotes}
					placeholder="Color preference, size, etc."
					class="input textarea"
					rows="2"
				></textarea>
			</div>
		</div>
		
		<button onclick={addItem} class="btn btn-add">
			<Icon icon="mdi:plus" width="20" height="20" />
			Add to List
		</button>
	</div>
	
	<div class="items-section">
		<div class="section-header">
			<h2 class="section-title">Your List ({items.length} {items.length === 1 ? 'item' : 'items'})</h2>
			{#if items.length > 0}
				<button onclick={saveList} class="btn btn-save">
					<Icon icon="mdi:content-save" width="20" height="20" />
					Save List
				</button>
			{/if}
		</div>
		
		{#if items.length === 0}
			<div class="empty-state">
				<Icon icon="mdi:gift-outline" width="80" height="80" style="color: #9ca3af; margin-bottom: 1rem;" />
				<p class="empty-text">No items yet. Add your first gift wish above!</p>
			</div>
		{:else}
			<div class="items-grid">
				{#each items as item (item.id)}
					<ListItem {item} onRemove={() => removeItem(item.id)} />
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if showShareModal}
	<div class="modal-overlay" onclick={closeModal}>
		<div class="modal" onclick={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h2 class="modal-title">
					<Icon icon="mdi:share-variant" width="28" height="28" />
					List Saved & Ready to Share!
				</h2>
				<button onclick={closeModal} class="modal-close">
					<Icon icon="mdi:close" width="24" height="24" />
				</button>
			</div>
			
			<div class="modal-body">
				<p class="modal-description">
					Share this link with your family and friends so they can see your wishlist!
				</p>
				
				<div class="link-container">
					<input 
						type="text" 
						readonly 
						value={shareableLink || ''} 
						class="link-input"
						onclick={(e) => e.currentTarget.select()}
					/>
					<button onclick={copyLink} class="btn-copy">
						<Icon icon="mdi:content-copy" width="20" height="20" />
						Copy Link
					</button>
				</div>
				
				<div class="share-info">
					<Icon icon="mdi:information-outline" width="20" height="20" style="color: #3b82f6; flex-shrink: 0;" />
					<p>When family members mark items as purchased, you won't see which items are claimed - it stays a surprise!</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	
	.header-section {
		text-align: center;
		margin-bottom: 3rem;
	}
	
	.list-title-input {
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		border: none;
		background: transparent;
		border-bottom: 2px solid transparent;
		padding: 0.5rem;
		width: 100%;
		transition: border-color 0.2s;
		color: #111827;
	}
	
	.list-title-input:hover,
	.list-title-input:focus {
		border-bottom-color: #ef4444;
		outline: none;
	}
	
	.subtitle {
		color: #6b7280;
		font-size: 1.125rem;
		margin-top: 0.5rem;
	}
	
	.add-item-section {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
		margin-bottom: 2rem;
	}
	
	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1.5rem;
	}
	
	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.form-group.full-width {
		grid-column: 1 / -1;
	}
	
	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}
	
	.input {
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: border-color 0.2s;
	}
	
	.input:focus {
		outline: none;
		border-color: #ef4444;
	}
	
	.textarea {
		resize: vertical;
		font-family: inherit;
	}
	
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.btn :global(svg) {
		flex-shrink: 0;
	}
	
	.btn-add {
		background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
		color: white;
		width: 100%;
		box-shadow: 0 2px 4px rgb(22 163 74 / 0.3);
	}
	
	.btn-add:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgb(22 163 74 / 0.4);
	}
	
	.btn-save {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		box-shadow: 0 2px 4px rgb(239 68 68 / 0.3);
	}
	
	.btn-save:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgb(239 68 68 / 0.4);
	}
	
	.items-section {
		margin-top: 3rem;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 1rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.empty-text {
		color: #6b7280;
		font-size: 1.125rem;
	}
	
	.items-grid {
		display: grid;
		gap: 1rem;
	}
	
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}
	
	.modal {
		background: white;
		border-radius: 1rem;
		max-width: 500px;
		width: 100%;
		box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.modal-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.modal-close {
		background: #f3f4f6;
		border: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6b7280;
	}
	
	.modal-close:hover {
		background: #e5e7eb;
		color: #374151;
	}
	
	.modal-body {
		padding: 1.5rem;
	}
	
	.modal-description {
		color: #6b7280;
		margin: 0 0 1.5rem 0;
	}
	
	.link-container {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}
	
	.link-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		background: #f9fafb;
		color: #374151;
		font-family: monospace;
	}
	
	.link-input:focus {
		outline: none;
		border-color: #3b82f6;
		background: white;
	}
	
	.btn-copy {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}
	
	.btn-copy:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgb(59 130 246 / 0.4);
	}
	
	.btn-copy :global(svg) {
		flex-shrink: 0;
	}
	
	.share-info {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		background: #eff6ff;
		border-radius: 0.5rem;
		border: 1px solid #bfdbfe;
	}
	
	.share-info p {
		margin: 0;
		font-size: 0.875rem;
		color: #1e40af;
		line-height: 1.5;
	}
	
	@media (max-width: 768px) {
		.list-title-input {
			font-size: 1.75rem;
		}
		
		.form-grid {
			grid-template-columns: 1fr;
		}
		
		.section-header {
			flex-direction: column;
			align-items: stretch;
		}
		
		.link-container {
			flex-direction: column;
		}
		
		.btn-copy {
			width: 100%;
		}
	}
</style>
