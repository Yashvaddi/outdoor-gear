import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../stores/CartContext';
import styles from './CartDrawer.module.scss';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus & lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
      >
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <ShoppingBag size={20} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems}</span>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <ShoppingBag size={52} strokeWidth={1} className={styles.emptyIcon} />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button className={styles.shopNowBtn} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.itemList}>
              {items.map((item) => (
                <li key={`${item.productId}-${item.colorId}-${item.sizeId}`} className={styles.item}>
                  <Link
                    to={`/product/${item.productId}`}
                    className={styles.itemImage}
                    onClick={onClose}
                    tabIndex={0}
                  >
                    <img src={item.image} alt={item.title} />
                  </Link>

                  <div className={styles.itemDetails}>
                    <Link
                      to={`/product/${item.productId}`}
                      className={styles.itemTitle}
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemVariant}>
                        {item.colorId.replace('c-', '')} / {item.sizeId.replace('s-', '').toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.itemFooter}>
                      {/* Quantity controls */}
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.colorId, item.sizeId, item.quantity - 1)
                              : removeFromCart(item.colorId, item.sizeId)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className={styles.qtyNum}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.colorId, item.sizeId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.colorId, item.sizeId)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className={styles.drawerFooter}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.subtotalAmount}>${cartTotal.toFixed(2)}</span>
              </div>
              <p className={styles.taxNote}>Shipping & taxes calculated at checkout</p>
              <button className={styles.checkoutBtn}>
                Checkout — ${cartTotal.toFixed(2)}
              </button>
              <button className={styles.continueBtn} onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
