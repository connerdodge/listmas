<script lang="ts">
	import { base } from '$app/paths';
	import { signOut } from '@auth/sveltekit/client';

	let { session } = $props();
</script>

<header class="bg-white/70 backdrop-blur-sm border-b border-red-100">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<a href="{base}/" class="text-2xl font-bold bg-gradient-to-r from-red-500 to-green-600 bg-clip-text text-transparent">
				🎄 Listmas
			</a>
			
			<div class="flex items-center gap-4">
				{#if session?.user}
					<span class="text-sm text-gray-600 hidden sm:inline">
						{session.user.name}
					</span>
					<button 
						onclick={() => signOut()}
						class="text-sm text-gray-600 hover:text-red-600 transition-colors"
					>
						Sign out
					</button>
				{/if}
			</div>
		</div>
	</nav>
</header>
