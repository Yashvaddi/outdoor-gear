import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: Set<number>;
  toggleWishlist: (productId: number) => void;
  isWishlisted:  (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'alpine_wishlist';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set<number>(JSON.parse(raw)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlistIds]));
  }, [wishlistIds]);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => wishlistIds.has(productId),
    [wishlistIds],
  );

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted, count: wishlistIds.size }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
