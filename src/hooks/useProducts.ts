import { useState, useEffect } from 'react';
import type { ProductCardData } from '../components/ProductCard/ProductCard';
import { env } from '../config/env';

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = category
      ? `${env.apiBaseUrl}/products/category/${encodeURIComponent(category)}`
      : `${env.apiBaseUrl}/products`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data: ProductCardData[]) => setProducts(data))
      .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
};
