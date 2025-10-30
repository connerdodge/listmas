# Listmas - Agent Instructions

## Project Overview
Listmas is a SvelteKit app for creating and sharing Christmas gift wishlists. Users can authenticate via Google OAuth, create lists, and share them with family and friends.

## Tech Stack
- **Framework**: SvelteKit 2.x with Svelte 5
- **Styling**: Tailwind CSS
- **Authentication**: Auth.js (formerly NextAuth.js) with Google OAuth
- **Package Manager**: Yarn
- **Node Version**: 22.12.0 (see `.nvmrc`)

## Development Commands
```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Type checking
yarn check

# Linting
yarn lint

# Format code
yarn format

# Run tests
yarn test
```

## Authentication Setup

The app uses Auth.js with Google OAuth. To set up authentication:

1. Create a `.env` file based on `.env.example`
2. Generate an auth secret: `npx auth secret`
3. Set up Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5173/auth/callback/google` (dev) and production URL
   - Copy Client ID and Client Secret to `.env`

## Project Structure
- `/src/routes/` - SvelteKit routes
- `/src/lib/` - Reusable components and utilities
- `/src/auth.ts` - Auth.js configuration
- `/src/hooks.server.ts` - SvelteKit server hooks

## Code Conventions
- Use TypeScript for type safety
- Follow existing Svelte 5 patterns (use runes: `$props`, `$state`, etc.)
- Use Tailwind CSS for styling, but component-scoped styles are acceptable
- Keep components simple and focused

## Features Roadmap
- [x] Landing page with Google OAuth
- [ ] Create Christmas list functionality
- [ ] Share list via link
- [ ] View shared lists
- [ ] Mark items as purchased (hidden from list owner)
- [ ] Email notifications for new purchases
