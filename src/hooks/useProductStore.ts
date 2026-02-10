import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, products as defaultProducts } from '@/lib/mockData';

interface ProductStoreState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      resetToDefaults: () => set({ products: defaultProducts }),
    }),
    { name: 'luce-divina-products' }
  )
);
