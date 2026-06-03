import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Header } from '../components/Header/Header';
import { ProductSection } from '../components/ProductSection/ProductSection';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  return (
    <div className={styles.page}>
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>New Season Arrivals</span>
            <h1 className={styles.heroTitle}>
              Gear Built for <br />
              <span className={styles.heroAccent}>Every Adventure</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Premium outdoor clothing and equipment, engineered for performance
              and designed for life beyond the trail.
            </p>
            <div className={styles.heroActions}>
              <Link to="/category/men" className={styles.heroCta}>
                Shop Men <ArrowRight size={18} />
              </Link>
              <Link to="/category/women" className={styles.heroCtaOutline}>
                Shop Women
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardBadge}>🔥 Trending Now</div>
              <img
                src="https://placehold.co/500x600/1e3a8a/FFFFFF?text=Alpine+Gear"
                alt="Featured alpine gear"
                className={styles.heroImage}
              />
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>4.8★</span>
              <span className={styles.heroStatLabel}>Avg. Rating</span>
            </div>
            <div className={`${styles.heroStat} ${styles.heroStatAlt}`}>
              <span className={styles.heroStatNum}>12K+</span>
              <span className={styles.heroStatLabel}>Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────── */}
      <section className={styles.trustBar}>
        <div className={`container ${styles.trustInner}`}>
          <div className={styles.trustItem}>
            <Truck size={22} className={styles.trustIcon} />
            <div>
              <strong>Free Shipping</strong>
              <span>On orders over $75</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <Shield size={22} className={styles.trustIcon} />
            <div>
              <strong>2-Year Warranty</strong>
              <span>On all gear & clothing</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <Zap size={22} className={styles.trustIcon} />
            <div>
              <strong>Fast Returns</strong>
              <span>30-day hassle-free returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Men's Section ────────────────────────────────────────── */}
      <ProductSection
        title="Men's Collection"
        subtitle="Built for him"
        category="men's clothing"
        limit={4}
        viewAllLink="/category/men"
        accentColor="blue"
      />

      {/* ── Women's Section ──────────────────────────────────────── */}
      <ProductSection
        title="Women's Collection"
        subtitle="Designed for her"
        category="women's clothing"
        limit={4}
        viewAllLink="/category/women"
        accentColor="rose"
      />

      {/* ── Trending / All Products ───────────────────────────────── */}
      <ProductSection
        title="Trending Now"
        subtitle="Most popular picks"
        limit={8}
        viewAllLink="/category/equipment"
        accentColor="amber"
      />

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>🔥 Sale — Up to 40% off</h2>
              <p className={styles.ctaSubtitle}>
                Limited time. Don't miss out on our best deals of the season.
              </p>
            </div>
            <Link to="/sale" className={styles.ctaBtn}>
              Shop the Sale <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            © 2026 Alpine Gear Co. All rights reserved. Built with ❤️ for outdoor adventurers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
