import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    // @ts-expect-error - this is a valid Vite plugin
    plugins: [sveltekit()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});
