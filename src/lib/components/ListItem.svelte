<script lang="ts">
	import { base } from '$app/paths';
	import Icon from '@iconify/svelte';

	type GiftItem = {
		id: string;
		name: string;
		url?: string;
		notes?: string;
		price?: string;
	};
	
	type LinkPreview = {
		title?: string;
		description?: string;
		image?: string;
		siteName?: string;
		url?: string;
		error?: string;
	};
	
	let { item, onRemove }: { item: GiftItem; onRemove: () => void } = $props();
	
	let linkPreview = $state<LinkPreview | null>(null);
	let loadingPreview = $state(false);
	let previewError = $state(false);
	let fetchedUrl = $state<string | null>(null);
	
	async function fetchLinkPreview(url: string) {
		// Don't fetch if already loading, already fetched this URL, or no URL
		if (!url || loadingPreview || fetchedUrl === url) return;
		
		fetchedUrl = url;
		loadingPreview = true;
		previewError = false;
		linkPreview = null;
		
		try {
			const response = await fetch(`${base}/api/link-preview?url=${encodeURIComponent(url)}`);
			
			if (!response.ok) {
				previewError = true;
				return;
			}
			
			const data = await response.json();
			
			if (data.error) {
				previewError = true;
				return;
			}
			
			linkPreview = data;
		} catch (error) {
			console.error('Error fetching link preview:', error);
			previewError = true;
		} finally {
			loadingPreview = false;
		}
	}
	
	$effect(() => {
		const url = item.url;
		if (url && fetchedUrl !== url) {
			fetchLinkPreview(url);
		}
	});
</script>

<div class="list-item">
	<div class="item-header">
		<h3 class="item-name">{item.name}</h3>
		<div class="item-actions">
			{#if item.price}
				<span class="price-badge">${item.price}</span>
			{/if}
			<button onclick={onRemove} class="btn-remove" title="Remove item">
				<Icon icon="mdi:delete" width="20" height="20" />
			</button>
		</div>
	</div>
	
	{#if item.notes}
		<p class="item-notes">{item.notes}</p>
	{/if}
	
	{#if item.url}
		<div class="link-section">
			<a href={item.url} target="_blank" rel="noopener noreferrer" class="item-link">
				<Icon icon="mdi:link" width="16" height="16" />
				View Product Link
			</a>
			
			{#if loadingPreview}
				<div class="link-preview loading">
					<div class="preview-skeleton">
						<div class="skeleton-image"></div>
						<div class="skeleton-text"></div>
					</div>
				</div>
			{:else if linkPreview && !previewError}
				<div class="link-preview">
					{#if linkPreview.image}
						<img src={linkPreview.image} alt={linkPreview.title || 'Product'} class="preview-image" />
					{/if}
					<div class="preview-content">
						{#if linkPreview.title}
							<p class="preview-title">{linkPreview.title}</p>
						{/if}
						{#if linkPreview.description}
							<p class="preview-description">{linkPreview.description}</p>
						{/if}
						<p class="preview-url">
							{linkPreview.siteName || new URL(item.url).hostname}
						</p>
					</div>
				</div>
			{:else if previewError}
				<div class="link-preview error">
					<p class="preview-error">
						<Icon icon="mdi:package-variant" width="16" height="16" />
						{new URL(item.url).hostname}
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.list-item {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
		transition: box-shadow 0.2s;
		list-style: none;
	}
	
	.list-item:hover {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	}
	
	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	
	.item-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
		flex: 1;
	}
	
	.item-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	
	.price-badge {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		color: #92400e;
		padding: 0.375rem 0.75rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
	}
	
	.btn-remove {
		background: #fee2e2;
		border: none;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #dc2626;
	}
	
	.btn-remove:hover {
		background: #fecaca;
		transform: scale(1.05);
	}
	
	.item-notes {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0 0 0.75rem 0;
		line-height: 1.5;
	}
	
	.link-section {
		margin-top: 1rem;
	}
	
	.item-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
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
	
	.item-link :global(svg) {
		flex-shrink: 0;
	}
	
	.link-preview {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
		transition: all 0.2s;
	}
	
	.link-preview:hover {
		border-color: #d1d5db;
		box-shadow: 0 2px 4px rgb(0 0 0 / 0.05);
	}
	
	.link-preview.loading {
		padding: 1rem;
	}
	
	.link-preview.error {
		background: #fef2f2;
		border-color: #fecaca;
	}
	
	.preview-skeleton {
		display: flex;
		gap: 0.75rem;
	}
	
	.skeleton-image {
		width: 80px;
		height: 80px;
		background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 0.375rem;
		flex-shrink: 0;
	}
	
	.skeleton-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.skeleton-text::before,
	.skeleton-text::after {
		content: '';
		height: 1rem;
		background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
		border-radius: 0.25rem;
	}
	
	.skeleton-text::after {
		width: 60%;
		height: 0.75rem;
	}
	
	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
	
	.preview-content {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	
	.preview-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.preview-description {
		font-size: 0.75rem;
		color: #6b7280;
		margin: 0;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-height: 1.4;
	}
	
	.preview-url {
		font-size: 0.75rem;
		color: #9ca3af;
		margin: 0;
		text-transform: lowercase;
	}
	
	.preview-error {
		font-size: 0.875rem;
		color: #991b1b;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	
	.preview-error :global(svg) {
		flex-shrink: 0;
	}
	
	.preview-image {
		width: 100%;
		max-height: 200px;
		object-fit: cover;
		border-radius: 0.375rem;
		margin-bottom: 0.75rem;
		background: #f3f4f6;
	}
</style>
