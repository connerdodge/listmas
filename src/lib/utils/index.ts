import { base } from '$app/paths';
import { page } from '$app/state';

export const pageUrl = (path: string) => `${base}/${path}`;
export const isPathCurrent = (path: string) => page.url.pathname === pageUrl(path);