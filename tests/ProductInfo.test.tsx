import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductInfo } from '../src/components/ProductInfo/ProductInfo';
import { CartProvider } from '../src/stores/CartContext';
import { mockExtendedData } from '../src/data/mockData';

const mockProduct = {
  id: 1,
  title: 'Test Backpack',
  price: 109.95,
  description: 'Test description',
  category: 'Test category',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 120 },
  ...mockExtendedData
};

import { WishlistProvider } from '../src/stores/WishlistContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
};

describe('ProductInfo Component', () => {
  it('disables the Add to Cart button when a sold-out size is selected', () => {
    // We mock URL search params internally or manually click
    renderWithProviders(<ProductInfo product={mockProduct} onColorChange={() => {}} />);
    
    // Size L is sold out (stock: 0) in our mock data
    const soldOutSizeBtn = screen.getByText('L');
    fireEvent.click(soldOutSizeBtn);
    
    const addToCartBtn = screen.getByRole('button', { name: /Sold Out/i });
    expect(addToCartBtn).toBeDisabled();
  });

  it('caps the quantity picker at available stock', () => {
    renderWithProviders(<ProductInfo product={mockProduct} onColorChange={() => {}} />);
    
    // Size M has stock 2
    const sizeMBtn = screen.getByText('M');
    fireEvent.click(sizeMBtn);
    
    const plusBtn = screen.getByRole('button', { name: /Increase quantity/i });
    
    // Click multiple times to exceed stock
    fireEvent.click(plusBtn);
    fireEvent.click(plusBtn);
    fireEvent.click(plusBtn);
    
    const qtyValue = screen.getByText('2'); // Should not exceed 2
    expect(qtyValue).toBeInTheDocument();
    expect(plusBtn).toBeDisabled(); // The plus button should disable at max stock
  });

  it('shows low stock warning for items with 5 or fewer in stock', () => {
    renderWithProviders(<ProductInfo product={mockProduct} onColorChange={() => {}} />);
    
    // Size M has stock 2, should show low stock banner
    const sizeMBtn = screen.getByText('M');
    fireEvent.click(sizeMBtn);
    
    // Testing library getByText handles nested nodes if we use a text matcher function or regex
    const lowStockText = screen.getByText(/Only.*2.*left in this size/i);
    expect(lowStockText).toBeInTheDocument();
  });
});
