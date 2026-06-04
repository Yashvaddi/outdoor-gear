import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { ProductCard } from '../components/ProductCard/ProductCard';
import type { ProductCardData } from '../components/ProductCard/ProductCard';
import { env } from '../config/env';
import styles from './CategoryPage.module.scss';

const SALE_PERCENTS: Record<number, number> = {};

const SalePage: React.FC = () => {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/products`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: ProductCardData[]) => {
        // Pick every other product for "sale" with a seeded discount
        const saleItems = data.filter((_, i) => i % 2 === 0).map(p => ({
          ...p,
          salePercent: SALE_PERCENTS[p.id] ?? (10 + (p.id * 7) % 30), // 10–40% off
        }));
        setProducts(saleItems);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={`${styles.hero} ${styles.heroSale}`}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Sale</span>
          </nav>
          <h1 className={styles.heroTitle}>🔥 Sale - Up to 40% Off</h1>
          <p className={styles.heroDesc}>
            Limited-time offers on our most popular outdoor gear. Don't miss out.
          </p>
        </div>
      </div>

      <main className={`container ${styles.main}`}>
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {loading ? 'Loading...' : `${products.length} items on sale`}
          </p>
        </div>

        {loading && (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default SalePage;
