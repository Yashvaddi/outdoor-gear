# Design Decisions

## Architectural Decisions

**1. State Management: React Context API vs. Redux/Zustand**
I chose to use the built-in React Context API (with standard hooks) over external libraries like Redux, Zustand, or Pinia. Given that the main global state required for this assignment is the Cart and Wishlist, pulling in an external dependency would introduce unnecessary overhead and boilerplate. Context API provides a lightweight, built-in solution that is perfectly suited for managing these states, which need to be accessible globally across the application but don't have extremely complex or frequent updates that would cause performance bottlenecks. If the app were to scale significantly (e.g., adding user authentication, complex checkout flows), migrating to Zustand would be a viable next step for better performance and slice management.

**2. Handling FakeStoreAPI Limitations**
The FakeStoreAPI provides basic product data but lacks the variants (colors, sizes, stock levels), features, and specs required by the assignment. Instead of building a full mock API backend, I created a local `mockData.ts` file that acts as a data enhancer. I created a custom `useProduct` hook that fetches the base product from the API and then merges it with our local extended data. This approach keeps the network request authentic while allowing us to fulfill all product requirements. The hook also implements a cancellation pattern (`cancelled` flag) to prevent state updates on unmounted components.

**3. Product Details Below Fold: Tabs vs. Accordion**
I opted for Tabs over an Accordion for the below-the-fold product details. Tabs offer a cleaner, more organized desktop experience where users can quickly switch between dense information (like specifications and reviews) without the page jumping vertically. For mobile, the tabs are horizontally scrollable (via `overflow-x: auto` with hidden scrollbar), maintaining a compact footprint while keeping all information accessible.

**4. Low Stock Indicator Pattern**
Rather than putting a badge *under* each size button (which caused layout overflow in earlier versions), I implemented two separate signals:
- A small amber dot (`lowStockPip`) absolutely positioned just below the size button, visible at a glance
- An inline alert banner below the size grid that appears only when the *selected* size has low stock, providing the specific count ("Only 3 left in this size order soon!")

This separates the two concerns: *discovery* (dot while browsing) and *urgency* (banner on selection).

**5. Wishlist with localStorage Persistence**
The Wishlist uses a `Set<number>` internally for O(1) has/add/delete operations, serialized to a JSON array in localStorage. The context provides `toggleWishlist`, `isWishlisted`, and a `count` value enough to power both the heart button on the PDP and the header badge. The heart icon in the header changes fill when at least one item is wishlisted.

**6. Cart Drawer vs. Cart Page**
I built a sliding `CartDrawer` component rather than navigating to a separate cart page. This provides a significantly better UX for reviewing/adjusting the cart without losing context on the current product. The drawer implements: backdrop blur, body scroll lock, Escape key close, focus management (`tabIndex={-1}` with auto-focus), and proper `aria-modal` roles.

## Image Zoom Implementation
The instructions mentioned supporting zoom on hover for desktop. I implemented an in-place cursor-tracking zoom within the image container. By tracking mouse coordinates as percentages of the container, the image scales up (`scale(2.2)`) with `transformOrigin` following the cursor position. A "Hover to zoom" hint badge is shown below the image on desktop until the user starts zooming. Navigation arrows appear on hover (and are always visible on mobile touch devices).

## Image Loading UX
Each time the main gallery image changes (color switch or thumbnail click), a shimmer skeleton is shown behind the image while it loads. The image fades in with a `fadeIn` animation when the `onLoad` event fires. This prevents the jarring "jump" of images loading.

## SCSS Architecture
- All tokens live in `_variables.scss` and are accessed via `@use './variables' as *`
- All component files use SCSS Modules (`*.module.scss`) for zero-conflict class scoping  
- `@use 'sass:color'` is used for color manipulation (replacing deprecated `darken()`)
- No `@import` directives (using modern `@use`/`@forward` which is required for Dart Sass 3.0 compatibility)
- CSS custom properties (`--swatch-color`) are used for the dynamic color swatches to avoid inline style props proliferating beyond what's needed

## The Three Open Questions (Spec Gaps)
The assignment mentions "The three open questions" to test if the developer can identify gaps in the spec and make a call. Here are the three major intentional gaps I identified and how I resolved them:

**1. Data Limitations of FakeStoreAPI vs. PDP Requirements**
*The Gap:* The spec requires color swatches, size buttons, per-variant stock alerts, and a multi-image gallery. However, the `FakeStoreAPI` only returns a single image, a title, price, and description. It has zero concept of variants, stock levels, or features.
*The Call:* Rather than building a full backend or hardcoding the entire product, I created an "enrichment layer" via `mockData.ts`. The custom `useProduct` hook fetches the real baseline data from the API and deep-merges it with local variant data (colors, sizes, stock counts, additional images). This demonstrates authentic async data fetching while perfectly fulfilling the complex UI requirements.

**2. Desktop Image Zoom vs. Low-Res Source Images**
*The Gap:* The spec requires "image should support zoom on hover", but FakeStoreAPI provides relatively low-resolution images (often 600px or less). Zooming in on these causes heavy pixelation, which breaks the "premium outdoor gear" aesthetic. 
*The Call:* I implemented a cursor-tracking `scale(2.2)` CSS transform to prove I can build the interaction pattern natively without external libraries. However, to mitigate the low-res reality of the API, I added a "Hover to zoom" hint and ensured the zoomed state is constrained within a sleek, rounded container with a `crosshair` cursor. In a true production environment, I would request a high-res `srcset` from the backend to swap out the image source upon zoom.

**3. Tabs vs. Accordion for Below-the-Fold Content**
*The Gap:* The spec explicitly asks to choose between tabs or an accordion for the Description/Specs/Reviews and justify it.
*The Call:* I built a hybrid approach. On desktop, it functions as a pure **Tabbed** interface because horizontal space is abundant, and users shouldn't have to scroll wildly up and down to cross-reference specs and reviews. On mobile, instead of an accordion (which pushes the user down the page and loses context), I kept the Tabbed layout but made the tab list horizontally scrollable. This keeps the mobile footprint incredibly compact and maintains a premium app-like feel.

## What I Would Do with More Time
1. **End-to-End Testing**: Implement Cypress or Playwright tests for the critical path (select variant → add to cart → open drawer → adjust quantity).
2. **Accessibility (a11y) Polish**: Complete screen-reader compatibility audit, including ARIA live regions for cart count changes and focus restoration after drawer close.
3. **Image Optimization**: Use `srcset` and `WebP` format for all gallery images, with `loading="lazy"` on thumbnails (already implemented).
4. **Wishlist Page**: A dedicated `/wishlist` route displaying all saved items with quick-add-to-cart actions.
5. **Search**: Wire up the search icon in the header to a command-palette-style modal that searches FakeStoreAPI products in real time.
6. **Proper Checkout Flow**: Multi-step checkout with address, payment mock, and order confirmation.
