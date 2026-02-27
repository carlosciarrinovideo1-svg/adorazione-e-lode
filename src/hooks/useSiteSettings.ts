import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface SocialLink {
  name: string;
  url: string;
  enabled: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  backgroundImage: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface BrandSettings {
  siteName: string;
  siteTagline: string;
  logoText: string;
  footerQuote: string;
  footerQuoteSource: string;
}

export interface SiteSettings {
  brand: BrandSettings;
  contact: ContactInfo;
  social: SocialLink[];
  hero: HeroContent;
}

const defaultSettings: SiteSettings = {
  brand: {
    siteName: "Luce Divina",
    siteTagline: "Libri e Musica Cristiana",
    logoText: "LD",
    footerQuote: "Il Signore è la mia luce e la mia salvezza",
    footerQuoteSource: "Salmo 27:1",
  },
  contact: {
    email: "info@lucedivina.it",
    phone: "+39 012 345 6789",
    address: "Roma, Italia",
  },
  social: [
    { name: "Facebook", url: "https://facebook.com", enabled: true },
    { name: "Instagram", url: "https://instagram.com", enabled: true },
    { name: "YouTube", url: "https://youtube.com", enabled: true },
  ],
  hero: {
    badge: "✝️ Nutri la tua fede con parole e melodie",
    title: "Libri e Musica per",
    titleHighlight: "Illuminare",
    subtitle: "Scopri la nostra selezione curata di libri spirituali e musica cristiana.",
    backgroundImage: "",
    stat1Value: "500+",
    stat1Label: "Titoli disponibili",
    stat2Value: "50k+",
    stat2Label: "Clienti soddisfatti",
    stat3Value: "4.9",
    stat3Label: "Valutazione media",
  },
};

interface SiteSettingsState {
  settings: SiteSettings;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateBrand: (brand: Partial<BrandSettings>) => Promise<void>;
  updateContact: (contact: Partial<ContactInfo>) => Promise<void>;
  updateSocial: (social: SocialLink[]) => Promise<void>;
  updateHero: (hero: Partial<HeroContent>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useSiteSettings = create<SiteSettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      fetchSettings: async () => {
        set({ isLoading: true });
        const { data, error } = await supabase
          .from('site_settings')
          .select('settings')
          .eq('id', 'main')
          .single();
        
        if (data && !error) {
          set({ settings: data.settings as SiteSettings });
        }
        set({ isLoading: false });
      },
      updateBrand: async (brand) => {
        const newSettings = { ...get().settings, brand: { ...get().settings.brand, ...brand } };
        set({ settings: newSettings });
        await supabase.from('site_settings').upsert({ id: 'main', settings: newSettings });
      },
      updateContact: async (contact) => {
        const newSettings = { ...get().settings, contact: { ...get().settings.contact, ...contact } };
        set({ settings: newSettings });
        await supabase.from('site_settings').upsert({ id: 'main', settings: newSettings });
      },
      updateSocial: async (social) => {
        const newSettings = { ...get().settings, social };
        set({ settings: newSettings });
        await supabase.from('site_settings').upsert({ id: 'main', settings: newSettings });
      },
      updateHero: async (hero) => {
        const newSettings = { ...get().settings, hero: { ...get().settings.hero, ...hero } };
        set({ settings: newSettings });
        await supabase.from('site_settings').upsert({ id: 'main', settings: newSettings });
      },
      resetToDefaults: async () => {
        set({ settings: defaultSettings });
        await supabase.from('site_settings').upsert({ id: 'main', settings: defaultSettings });
      },
    }),
    {
      name: 'luce-divina-site-settings',
    }
  )
);