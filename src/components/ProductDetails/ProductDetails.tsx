import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './ProductDetails.module.scss';
import type { FullProduct } from '../../hooks/useProduct';

interface ProductDetailsProps {
  product: FullProduct;
}

type TabType = 'description' | 'specifications' | 'reviews';

const REVIEWS = [
  {
    author: 'Alex M.',
    date: '2 weeks ago',
    rating: 5,
    title: 'Best backpack for daily use',
    text: "I've been using this for my commute for a month now. It fits my 15\" laptop perfectly and has just enough space for lunch and a jacket. Super comfortable even on long days.",
  },
  {
    author: 'Sarah T.',
    date: '1 month ago',
    rating: 4,
    title: 'Durable but initially stiff',
    text: 'The material is incredibly tough, which is great for outdoor use. However, it was a bit stiff out of the box. It has broken in nicely over 3 weeks and now feels fantastic.',
  },
  {
    author: 'Jordan K.',
    date: '3 months ago',
    rating: 5,
    title: 'Worth every penny',
    text: "Took this on a 3-day hike and it held up beautifully. The water resistance is no joke — got caught in a downpour and all my gear stayed perfectly dry inside.",
  },
];

const StarRow: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className={styles.starRow}>
    {[1, 2, 3, 4, 5].map(n => (
      <Star
        key={n}
        size={size}
        fill={n <= rating ? '#f59e0b' : 'none'}
        color={n <= rating ? '#f59e0b' : '#475569'}
      />
    ))}
  </div>
);

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs: { key: TabType; label: string }[] = [
    { key: 'description',   label: 'Description' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'reviews',       label: `Reviews (${REVIEWS.length})` },
  ];

  const avgRating = product.rating.rate;
  const reviewCount = product.rating.count;

  return (
    <div className={styles.container} id="product-details">
      {/* Tab Navigation */}
      <div className={styles.tabList} role="tablist">
        {tabs.map(t => (
          <button
            key={t.key}
            id={`tab-${t.key}`}
            role="tab"
            aria-selected={activeTab === t.key}
            aria-controls={`panel-${t.key}`}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <div className={styles.tabIndicator} style={{ '--tab-index': tabs.findIndex(t => t.key === activeTab) } as React.CSSProperties} />
      </div>

      {/* Tab Panels */}
      <div className={styles.panels}>
        {/* Description */}
        <div
          id="panel-description"
          role="tabpanel"
          aria-labelledby="tab-description"
          hidden={activeTab !== 'description'}
          className={styles.panel}
        >
          <h3 className={styles.panelTitle}>Product Overview</h3>
          <p className={styles.bodyText}>{product.description}</p>
          <p className={styles.bodyText}>
            Designed for urban adventurers and outdoor explorers alike. Every pocket, strap, 
            and zipper has been engineered to work exactly when you need it — whether you're 
            commuting through the city or navigating mountain trails.
          </p>
        </div>

        {/* Specifications */}
        <div
          id="panel-specifications"
          role="tabpanel"
          aria-labelledby="tab-specifications"
          hidden={activeTab !== 'specifications'}
          className={styles.panel}
        >
          <h3 className={styles.panelTitle}>Technical Specifications</h3>
          <table className={styles.specTable}>
            <tbody>
              {product.specs?.map(spec => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews */}
        <div
          id="panel-reviews"
          role="tabpanel"
          aria-labelledby="tab-reviews"
          hidden={activeTab !== 'reviews'}
          className={styles.panel}
        >
          {/* Summary */}
          <div className={styles.reviewSummary}>
            <div className={styles.summaryScore}>
              <span className={styles.bigRating}>{avgRating}</span>
              <StarRow rating={Math.round(avgRating)} size={20} />
              <span className={styles.reviewCount}>Based on {reviewCount} reviews</span>
            </div>

            {/* Rating bars */}
            <div className={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map(n => {
                const pct = n === 5 ? 68 : n === 4 ? 22 : n === 3 ? 7 : n === 2 ? 2 : 1;
                return (
                  <div key={n} className={styles.barRow}>
                    <span className={styles.barLabel}>{n}★</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.barPct}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className={styles.reviewList}>
            {REVIEWS.map((r, i) => (
              <article key={i} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAvatar}>{r.author.charAt(0)}</div>
                  <div>
                    <div className={styles.reviewAuthor}>{r.author}</div>
                    <div className={styles.reviewDate}>{r.date}</div>
                  </div>
                  <div className={styles.reviewStars}>
                    <StarRow rating={r.rating} />
                  </div>
                </div>
                <h4 className={styles.reviewTitle}>{r.title}</h4>
                <p className={styles.reviewText}>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
