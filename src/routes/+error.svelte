<script>
  import { page } from '$app/state';
</script>

<section>
  <h1>Error {page.status}</h1>
  <p>{page.error?.message}</p>
  <p>Something went wrong</p>
</section>

<style lang="postcss">
  section {
    @apply mt-20 text-center;
  }
  
  p {
    @apply font-mono;
  }
</style>

