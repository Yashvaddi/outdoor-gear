# Alpine Gear Co. - Product Detail Page

**Live Demo:** [Outdoor Gear](https://outdoor-gear.vercel.app/)

A production-quality React Product Detail Page built for a premium outdoor gear store.

## Features
- **Dynamic Image Gallery**: Thumbnail support, active state tracking, mobile horizontal scrolling, and desktop hover-to-zoom.
- **Product Info**: Color swatches, size selectors (with out-of-stock and low-stock states), and a quantity picker capped at available stock.
- **URL State**: Variant selection is deeply linked via URL query parameters, making the exact product configuration shareable.
- **Persistent Cart**: Global cart state managed via Context API and synced with `localStorage`. Includes simulated async add-to-cart functionality with random network failures for realism.
- **Responsive Layout**: Two-column layout for desktop (>767px) that gracefully degrades to a single column on mobile devices.
- **Clean Architecture**: Built with React 18, Vite, SCSS Modules (no Tailwind or CSS-in-JS), and strong TypeScript typing.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Architecture & Design Decisions
For a deep dive into why specific architectural choices were made (like using Context API over Redux, or Tabs vs Accordions), please see the **[DECISIONS.md](./DECISIONS.md)** file located in the root of the repository.

### Known Trade-offs
- **FakeStoreAPI Limitations**: The external API does not support variants, colors, sizes, or multiple high-res images. To bypass this while still fulfilling the spec, a local `mockData.ts` enrichment layer is merged with the live API response.
- **Low-Resolution Zoom**: Because the external API provides small images, the desktop hover-zoom feature scales a low-res image. In a true production environment, a `srcset` would be used to fetch a higher-resolution asset on hover.
- **Global State Libraries**: Context API was chosen to keep the bundle size small given the scope. For a massively scaled application, migrating to Zustand or Redux Toolkit would be preferred for slice management.

## Project Structure
- `/src/components`: Focused, reusable UI components (Gallery, Info, Details, Header)
- `/src/hooks`: Custom React hooks (`useProduct` for API fetching)
- `/src/stores`: Global state management (`CartContext`, `WishlistContext`)
- `/src/styles`: Global SCSS, variables, and mixins
- `/src/data`: Mock data extensions to complement the FakeStoreAPI
- `/tests`: Unit tests for critical functions (Bonus)
- `/docs`: Documentation including Lighthouse reports

## Testing (Bonus)
Unit tests for the variant selector logic (sold-out state, quantity caps, CTA disabling) are located in `/tests/ProductInfo.test.tsx`.
Run tests via Vitest:
```bash
npm run test
```
