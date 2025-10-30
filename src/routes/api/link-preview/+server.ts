import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import ogs from 'open-graph-scraper';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');
	
	if (!targetUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 });
	}
	
	try {
		// Validate URL
		new URL(targetUrl);
		
		// Fetch Open Graph data
		const { error, result } = await ogs({ url: targetUrl, timeout: 5000 });
		
		if (error) {
			return json({ error: 'Failed to fetch metadata' }, { status: 500 });
		}
		
		// Extract relevant data
		const preview = {
			title: result.ogTitle || result.twitterTitle || result.dcTitle,
			description: result.ogDescription || result.twitterDescription || result.dcDescription,
			image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
			siteName: result.ogSiteName,
			url: targetUrl
		};
		
		return json(preview);
	} catch (err) {
		console.error('Error fetching link preview:', err);
		return json({ error: 'Invalid URL or failed to fetch' }, { status: 400 });
	}
};
