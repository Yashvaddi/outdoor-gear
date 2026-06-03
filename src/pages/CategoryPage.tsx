import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { ProductCard } from '../components/ProductCard/ProductCard';
import type { ProductCardData } from '../components/ProductCard/ProductCard';
import { env } from '../config/env';
import styles from './CategoryPage.module.scss';

// Map URL slug -> FakeStoreAPI category string
const CATEGORY_MAP: Record<string, { apiCategory: string; label: string; description: string }> = {
  men: {
    apiCategory: "men's clothing",
    label: "Men's Collection",
    description: 'Explore our premium range of outdoor and everyday wear for men.',
  },
  women: {
    apiCategory: "women's clothing",
    label: "Women's Collection",
    description: 'Discover stylish, functional apparel built for adventure and everyday life.',
  },
  equipment: {
    apiCategory: 'electronics',
    label: 'Gear & Equipment',
    description: 'High-performance gear and equipment for every outdoor pursuit.',
  },
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const CategoryPage: React.FC = () => {
  const { category = 'men' } = useParams<{ category: string }>();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>('default');

  const meta = CATEGORY_MAP[category] ?? CATEGORY_MAP['men'];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${env.apiBaseUrl}/products/category/${encodeURIComponent(meta.apiCategory)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: ProductCardData[]) => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, meta.apiCategory]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'rating') return b.rating.rate - a.rating.rate;
    return 0;
  });

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{meta.label}</span>
          </nav>
          <h1 className={styles.heroTitle}>{meta.label}</h1>
          <p className={styles.heroDesc}>{meta.description}</p>
        </div>
      </div>

      <main className={`container ${styles.main}`}>
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {loading ? 'Loading...' : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
          </p>
          <div className={styles.sortWrapper}>
            <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value as SortOption)}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
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
            {sorted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
