import React, { useState, useEffect } from 'react';
import { ShoppingCart, Mountain, User, Search, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../../stores/CartContext';
import { useWishlist } from '../../stores/WishlistContext';
import { CartDrawer } from '../CartDrawer/CartDrawer';
import styles from './Header.module.scss';
import { Link, NavLink } from 'react-router-dom';

export const Header: React.FC = () => {
  const { items } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [cartOpen,   setCartOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Add shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { to: '/category/men',       label: 'Men' },
    { to: '/category/women',     label: 'Women' },
    { to: '/category/equipment', label: 'Equipment' },
    { to: '/sale',               label: 'Sale' },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link to="/" onClick={closeMobile}>
              <Mountain size={26} className={styles.logoIcon} />
              <span className={styles.logoText}>ALPINE GEAR</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className={styles.navDesktop} aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={styles.actions}>
            <button className={styles.actionButton} aria-label="Search">
              <Search size={21} />
            </button>

            <button className={styles.actionButton} aria-label="Account">
              <User size={21} />
            </button>

            {/* Wishlist */}
            <button className={styles.actionButton} aria-label={`Wishlist (${wishlistCount} items)`}>
              <Heart
                size={21}
                fill={wishlistCount > 0 ? 'currentColor' : 'none'}
                className={wishlistCount > 0 ? styles.heartActive : ''}
              />
              {wishlistCount > 0 && (
                <span className={styles.wishlistBadge}>{wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              id="cart-button"
              className={styles.cartButton}
              aria-label={`Cart (${totalItems} items)`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={21} />
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className={`${styles.actionButton} ${styles.menuButton}`}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <nav
          className={`${styles.navMobile} ${mobileOpen ? styles.navMobileOpen : ''}`}
          aria-label="Mobile navigation"
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
              }
              onClick={closeMobile}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
