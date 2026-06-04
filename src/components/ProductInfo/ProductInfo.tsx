import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, Check, AlertCircle, Heart, Star, Shield, RotateCcw, ChevronDown } from 'lucide-react';
import { useCart } from '../../stores/CartContext';
import { useWishlist } from '../../stores/WishlistContext';
import type { FullProduct } from '../../hooks/useProduct';
import styles from './ProductInfo.module.scss';

interface ProductInfoProps {
  product: FullProduct;
  onColorChange: (colorId: string) => void;
}

const LOW_STOCK_THRESHOLD = 5;

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onColorChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, isAdding, error, clearError } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const colorParam = searchParams.get('color');
  const sizeParam = searchParams.get('size');

  const selectedColor = product.colors.find(c => c.id === colorParam) ?? product.colors[0];
  const selectedSize = product.sizes.find(s => s.id === sizeParam) ?? product.sizes.find(s => s.stock > 0) ?? product.sizes[0];

  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const wishlisted = isWishlisted(product.id);

  // Synchronise initial URL params
  useEffect(() => {
    if (!colorParam || !sizeParam) {
      setSearchParams(
        { color: selectedColor.id, size: selectedSize.id },
        { replace: true },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Propagate color change to gallery
  useEffect(() => {
    onColorChange(selectedColor.id);
  }, [selectedColor.id, onColorChange]);

  // Cap quantity when size changes
  useEffect(() => {
    if (selectedSize.stock > 0 && quantity > selectedSize.stock) {
      setQuantity(Math.max(1, selectedSize.stock));
    }
  }, [selectedSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorSelect = useCallback((colorId: string) => {
    setSearchParams(prev => { prev.set('color', colorId); return prev; });
  }, [setSearchParams]);

  const handleSizeSelect = useCallback((sizeId: string) => {
    setSearchParams(prev => { prev.set('size', sizeId); return prev; });
  }, [setSearchParams]);

  const handleAddToCart = async () => {
    if (isSoldOut) return;
    try {
      await addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        colorId: selectedColor.id,
        sizeId: selectedSize.id,
        quantity,
        image: selectedColor.image,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch { /* Handled by context */ }
  };

  const isSoldOut = selectedSize.stock === 0;
  const isLowStock = selectedSize.stock > 0 && selectedSize.stock <= LOW_STOCK_THRESHOLD;

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  // Star rating helpers
  const fullStars = Math.floor(product.rating.rate);
  const hasHalfStar = product.rating.rate % 1 >= 0.5;

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.productInfo}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <span className={styles.brand}>Alpine Gear Co.</span>
          {product.badge && (
            <span className={styles.productBadge}>{product.badge}</span>
          )}
        </div>

        <h1 className={styles.title}>{product.title}</h1>

        {/* Star rating */}
        <div className={styles.ratingRow}>
          <div className={styles.stars} aria-label={`Rating: ${product.rating.rate} out of 5`}>
            {[1, 2, 3, 4, 5].map(n => (
              <Star
                key={n}
                size={15}
                fill={n <= fullStars ? '#f59e0b' : (n === fullStars + 1 && hasHalfStar ? 'url(#half)' : 'none')}
                color={n <= fullStars || (n === fullStars + 1 && hasHalfStar) ? '#f59e0b' : '#475569'}
              />
            ))}
          </div>
          <span className={styles.ratingValue}>{product.rating.rate}</span>
          <span className={styles.ratingCount}>({product.rating.count} reviews)</span>
        </div>

        {/* Price */}
        <div className={styles.priceContainer}>
          <span className={styles.salePrice}>${product.price.toFixed(2)}</span>
          <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
          <span className={styles.discountBadge}>−{discount}% OFF</span>
        </div>
      </div>

      {/* ── Color ──────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Color</span>
          <span className={styles.selectedValue}>{selectedColor.name}</span>
        </div>
        <div className={styles.swatches} role="radiogroup" aria-label="Color selection">
          {product.colors.map(color => (
            <button
              key={color.id}
              role="radio"
              aria-checked={selectedColor.id === color.id}
              aria-label={`Color: ${color.name}`}
              className={`${styles.swatch} ${selectedColor.id === color.id ? styles.swatchActive : ''}`}
              style={{ '--swatch-color': color.hex } as React.CSSProperties}
              onClick={() => handleColorSelect(color.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Size ───────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Size</span>
          <span className={styles.selectedValue}>{selectedSize.name}</span>
          <a href="#size-guide" className={styles.sizeGuideLink}>Size guide</a>
        </div>
        <div className={styles.sizeGrid} role="radiogroup" aria-label="Size selection">
          {product.sizes.map(size => {
            const outOfStock = size.stock === 0;
            const lowStock = size.stock > 0 && size.stock <= LOW_STOCK_THRESHOLD;
            const isSelected = selectedSize.id === size.id;

            return (
              <div key={size.id} className={styles.sizeCell}>
                <button
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Size ${size.name}${outOfStock ? ', sold out' : lowStock ? `, only ${size.stock} left` : ''}`}
                  className={`
                    ${styles.sizeBtn}
                    ${isSelected ? styles.sizeBtnActive : ''}
                    ${outOfStock ? styles.sizeBtnSoldOut : ''}
                    ${lowStock && !isSelected ? styles.sizeBtnLow : ''}
                  `}
                  disabled={outOfStock}
                  onClick={() => !outOfStock && handleSizeSelect(size.id)}
                >
                  {size.name}
                </button>
                {lowStock && !outOfStock && (
                  <span className={styles.lowStockPip} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* Inline stock alerts */}
        {isSoldOut && (
          <div className={styles.stockAlert} data-type="soldout">
            <AlertCircle size={15} />
            <span>This size is sold out. Check back soon or select another.</span>
          </div>
        )}
        {isLowStock && !isSoldOut && (
          <div className={styles.stockAlert} data-type="low">
            <AlertCircle size={15} />
            <span>Only <strong>{selectedSize.stock}</strong> left in this size order soon!</span>
          </div>
        )}
      </div>

      {/* ── Quantity ────────────────────────────────────────────────── */}
      {!isSoldOut && (
        <div className={styles.section}>
          <span className={styles.sectionTitle}>Quantity</span>
          <div className={styles.quantityPicker}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className={styles.qtyValue} aria-live="polite">{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => Math.min(selectedSize.stock, q + 1))}
              disabled={quantity >= selectedSize.stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* ── Feedback ────────────────────────────────────────────────── */}
      {error && (
        <div className={styles.feedbackBanner} data-type="error" role="alert">
          <AlertCircle size={15} />
          <span>{error}</span>
          <button onClick={clearError} className={styles.dismissBtn} aria-label="Dismiss error">×</button>
        </div>
      )}
      {showSuccess && (
        <div className={styles.feedbackBanner} data-type="success" role="status">
          <Check size={15} />
          <span>Added to your cart!</span>
        </div>
      )}

      {/* ── CTAs ────────────────────────────────────────────────────── */}
      <div className={styles.ctaRow}>
        <button
          id="add-to-cart-button"
          className={`${styles.addToCart} ${isSoldOut ? styles.addToCartDisabled : ''}`}
          disabled={isSoldOut || isAdding}
          onClick={handleAddToCart}
          aria-label={isSoldOut ? 'Sold out' : isAdding ? 'Adding to cart' : 'Add to cart'}
        >
          {isAdding ? (
            <span className={styles.btnSpinner} />
          ) : isSoldOut ? (
            'Sold Out'
          ) : (
            `Add to Cart $${(product.price * quantity).toFixed(2)}`
          )}
        </button>

        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistBtnActive : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* ── Delivery Estimate ───────────────────────────────────────── */}
      {!isSoldOut && (
        <div className={styles.deliveryEstimate}>
          <Truck size={16} className={styles.estimateIcon} />
          <span>Order now and get it by <strong>{getDeliveryDate()}</strong></span>
        </div>
      )}

      {/* ── Trust Strip ─────────────────────────────────────────────── */}
      <div className={styles.trustStrip}>
        <div className={styles.trustItem}>
          <Truck size={16} className={styles.trustIcon} />
          <div>
            <strong>Free Delivery</strong>
            <span>3–5 business days</span>
          </div>
        </div>
        <div className={styles.trustItem}>
          <RotateCcw size={16} className={styles.trustIcon} />
          <div>
            <strong>30-Day Returns</strong>
            <span>Hassle-free</span>
          </div>
        </div>
        <div className={styles.trustItem}>
          <Shield size={16} className={styles.trustIcon} />
          <div>
            <strong>2-Year Warranty</strong>
            <span>On all gear</span>
          </div>
        </div>
      </div>

      {/* ── Key Features Collapsible ─────────────────────────────────── */}
      {product.features && product.features.length > 0 && (
        <div className={styles.featuresSection}>
          <button
            className={styles.featuresToggle}
            onClick={() => setShowFeatures(f => !f)}
            aria-expanded={showFeatures}
          >
            <span>Key Features</span>
            <ChevronDown
              size={18}
              className={`${styles.chevron} ${showFeatures ? styles.chevronOpen : ''}`}
            />
          </button>
          <ul
            className={`${styles.featuresList} ${showFeatures ? styles.featuresListOpen : ''}`}
          >
            {product.features.map((f, i) => (
              <li key={i} className={styles.featureItem}>
                <Check size={14} className={styles.featureCheck} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
