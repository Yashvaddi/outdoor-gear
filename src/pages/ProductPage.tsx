import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGallery } from '../components/ProductGallery/ProductGallery';
import { ProductInfo } from '../components/ProductInfo/ProductInfo';
import { ProductDetails } from '../components/ProductDetails/ProductDetails';
import { Header } from '../components/Header/Header';
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';
import { ProductGallerySkeleton, ProductInfoSkeleton } from '../components/Skeleton/Skeleton';
import { useProduct } from '../hooks/useProduct';
import { useSEO } from '../hooks/useSEO';
import styles from './ProductPage.module.scss';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id ?? '1', 10);
  const { product, loading, error } = useProduct(productId);
  const [activeColorId, setActiveColorId] = useState<string | null>(null);

  useSEO({
    title: product ? `${product.title} — Alpine Gear Co.` : 'Loading product...',
    description: product
      ? `Shop ${product.title} from Alpine Gear Co. Premium outdoor gear starting at $${product.price.toFixed(2)}.`
      : 'Premium outdoor gear and apparel',
  });

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={`container ${styles.main}`}>
          {/* Breadcrumb skeleton */}
          <div className={styles.breadcrumbSkeleton} aria-hidden="true" />
          <div className={styles.productGrid}>
            <div className={styles.galleryCol}>
              <ProductGallerySkeleton />
            </div>
            <div className={styles.infoCol}>
              <ProductInfoSkeleton />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={`container ${styles.errorContainer}`}>
          <div className={styles.errorCard}>
            <span className={styles.errorEmoji}>🏔️</span>
            <h2>Oops! Something went wrong</h2>
            <p>{error ?? 'Product not found. It may have been removed or the link is invalid.'}</p>
            <div className={styles.errorActions}>
              <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                Try Again
              </button>
              <Link to="/" className={styles.homeBtn}>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const selectedColor  = product.colors.find(c => c.id === activeColorId) ?? product.colors[0];
  const imagesToShow   = selectedColor.thumbnails;

  const breadcrumbs = [
    { label: 'Home',                     href: '/' },
    { label: product.category,           href: `/category/${encodeURIComponent(product.category)}` },
    { label: product.title },
  ];

  return (
    <div className={styles.page}>
      <Header />
      <main className={`container ${styles.main}`}>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* 2-col grid */}
        <div className={styles.productGrid}>
          <div className={styles.galleryCol}>
            <ProductGallery images={imagesToShow} productTitle={product.title} />
          </div>
          <div className={styles.infoCol}>
            <ProductInfo product={product} onColorChange={setActiveColorId} />
          </div>
        </div>

        {/* Below-fold tabs */}
        <ProductDetails product={product} />
      </main>
    </div>
  );
}
