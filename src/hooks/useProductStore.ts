import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, products as defaultProducts } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      isLoading: false,
      fetchProducts: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data && !error) {
          // Mappatura nomi colonne se necessario (Supabase usa snake_case spesso)
          const mappedData = data.map(p => ({
            ...p,
            ISBN_ASIN: p.isbn_asin, // Mappatura per compatibilità con il resto del codice
          })) as unknown as Product[];
          set({ products: mappedData.length > 0 ? mappedData : defaultProducts });
        }
        set({ isLoading: false });
      },
      addProduct: async (product) => {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...product,
            isbn_asin: product.ISBN_ASIN,
          }])
          .select()
          .single();
        
        if (data && !error) {
          await get().fetchProducts();
        }
      },
      removeProduct: async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
          set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        }
      },
      updateProduct: async (id, updates) => {
        const { error } = await supabase
          .from('products')
          .update({
            ...updates,
            isbn_asin: updates.ISBN_ASIN,
          })
          .eq('id', id);
        
        if (!error) {
          await get().fetchProducts();
        }
      },
      resetToDefaults: async () => {
        // Opzionale: pulire DB e ricaricare default
        set({ products: defaultProducts });
      },
    }),
    { name: 'luce-divina-products' }
  )
);