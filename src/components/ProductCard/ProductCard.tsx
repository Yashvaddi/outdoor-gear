import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import styles from './ProductCard.module.scss';

export interface ProductCardData {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: { rate: number; count: number };
  salePercent?: number;
}

interface ProductCardProps {
  product: ProductCardData;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const salePrice = product.salePercent
    ? +(product.price * (1 - product.salePercent / 100)).toFixed(2)
    : null;

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} className={styles.image} loading="lazy" />
        {product.salePercent && (
          <span className={styles.saleBadge}>-{product.salePercent}%</span>
        )}
        <div className={styles.overlay}>
          <span className={styles.quickView}>
            <ShoppingCart size={16} />
            Quick View
          </span>
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.round(product.rating.rate) ? styles.starFilled : styles.starEmpty}
              fill={i < Math.round(product.rating.rate) ? 'currentColor' : 'none'}
            />
          ))}
          <span className={styles.ratingCount}>({product.rating.count})</span>
        </div>

        <div className={styles.priceRow}>
          {salePrice ? (
            <>
              <span className={styles.salePrice}>${salePrice}</span>
              <span className={styles.originalPrice}>${product.price}</span>
            </>
          ) : (
            <span className={styles.price}>${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};
