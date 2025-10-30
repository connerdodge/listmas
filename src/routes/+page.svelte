<script lang="ts">
	import { base } from '$app/paths';
	import { signIn } from '@auth/sveltekit/client';
	import googleIcon from '$lib/images/google.svg';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Listmas - Share Your Christmas Wishlist</title>
	<meta name="description" content="Create and share your Christmas gift list with family and friends" />
</svelte:head>

<div class="landing-container">
	<div class="hero">
		<h1 class="hero-title">
			🎄 Listmas
		</h1>
		<p class="hero-subtitle">
			Create and share your Christmas wishlist with family and friends
		</p>
		
		{#if data.session?.user}
			<div class="welcome-section">
				<a href="{base}/lists/create" class="btn btn-primary">
					✨ Create Your Christmas List
				</a>
			</div>
		{:else}
			<div class="cta-section">
				<button 
					onclick={() => signIn('google')}
					class="btn btn-primary"
				>
					<img src={googleIcon} class="google-icon" alt="Google" />
					Sign in with Google
				</button>
				
				<div class="features">
					<div class="feature">
						<span class="feature-icon">🎁</span>
						<h3>Create Your List</h3>
						<p>Add all your Christmas wishes in one place</p>
					</div>
					<div class="feature">
						<span class="feature-icon">🔗</span>
						<h3>Share with Family</h3>
						<p>Send a simple link to your loved ones</p>
					</div>
					<div class="feature">
						<span class="feature-icon">✅</span>
						<h3>Track Purchases</h3>
						<p>Family can mark items as purchased (hidden from you!)</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.landing-container {
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
	}

	.hero {
		text-align: center;
		max-width: 800px;
		width: 100%;
	}

	.hero-title {
		font-size: 4rem;
		font-weight: 700;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #ef4444 0%, #16a34a 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 1.2;
	}

	.hero-subtitle {
		font-size: 1.5rem;
		color: #374151;
		margin-bottom: 3rem;
	}

	.cta-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
	}

	.welcome-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		font-size: 1.125rem;
		font-weight: 600;
		border-radius: 0.75rem;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}

	.btn-primary {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		box-shadow: 0 4px 6px -1px rgb(239 68 68 / 0.3), 0 2px 4px -2px rgb(239 68 68 / 0.3);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 15px -3px rgb(239 68 68 / 0.4), 0 4px 6px -4px rgb(239 68 68 / 0.4);
	}

	.google-icon {
		width: 24px;
		height: 24px;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		width: 100%;
		margin-top: 2rem;
	}

	.feature {
		background: white;
		padding: 2rem 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	}

	.feature-icon {
		font-size: 2.5rem;
		display: block;
		margin-bottom: 1rem;
	}

	.feature h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.feature p {
		color: #6b7280;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-subtitle {
			font-size: 1.125rem;
		}

		.features {
			grid-template-columns: 1fr;
		}
	}
</style>
