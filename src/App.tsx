import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './stores/CartContext';
import { WishlistProvider } from './stores/WishlistContext';
import './styles/global.scss';

// ── Page-level code-splitting ─────────────────────────────────────────────
const HomePage    = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CategoryPage= lazy(() => import('./pages/CategoryPage'));
const SalePage    = lazy(() => import('./pages/SalePage'));

// ── Loading fallback (matches page bg, no flash) ──────────────────────────
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0b0f19',
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: '3px solid #1e293b',
        borderTop: '3px solid #ff6b35',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"                   element={<HomePage />} />
              <Route path="/product/:id"        element={<ProductPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/sale"               element={<SalePage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}
