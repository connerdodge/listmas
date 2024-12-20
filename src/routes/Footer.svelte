<script lang="ts">
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<footer>
  <a href="https://svelte.dev/docs/kit">
    <img src={logo} alt="SvelteKit" />
  </a>
  <a href="https://github.com/connerdodge/listmas">
    <img src={github} alt="GitHub" />
  </a>
</footer>

<style>
  footer {
		display: flex;
    justify-content: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}

  img {
    width: 2em;
    height: 2em;
  }
</style>