import { useState, useEffect } from 'react';
import { mockExtendedData } from '../data/mockData';
import type { ExtendedProductData } from '../data/mockData';
import { env } from '../config/env';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface FullProduct extends Product, ExtendedProductData {}

export const useProduct = (productId: number) => {
  const [product, setProduct]   = useState<FullProduct | null>(null);
  const [loading, setLoading]   = useState<boolean>(true);
  const [error,   setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${env.apiBaseUrl}/products/${productId}`);
        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const data: Product = await response.json();

        if (!cancelled) {
          const fullProduct: FullProduct = {
            ...data,
            ...mockExtendedData,
            // Use a curated outdoor image as the primary image
            image: mockExtendedData.colors[0].image,
          };
          setProduct(fullProduct);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { product, loading, error };
};
