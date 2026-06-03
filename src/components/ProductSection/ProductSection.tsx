import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import styles from './ProductSection.module.scss';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  category?: string;   // FakeStoreAPI category string
  limit?: number;
  viewAllLink: string;
  accentColor?: 'blue' | 'rose' | 'amber';
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  category,
  limit = 4,
  viewAllLink,
  accentColor = 'blue',
}) => {
  const { products, loading } = useProducts(category);
  const visible = products.slice(0, limit);

  return (
    <section className={`${styles.section} ${styles[accentColor]}`}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{subtitle}</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <Link to={viewAllLink} className={styles.viewAll}>
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {visible.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
