import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export interface FontSettings {
  headingFont: string;
  bodyFont: string;
}

export interface SiteSettings {
  brand: BrandSettings;
  contact: ContactInfo;
  social: SocialLink[];
  hero: HeroContent;
  fonts: FontSettings;
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
    { name: "X", url: "https://x.com", enabled: false },
  ],
  hero: {
    badge: "✝️ Nutri la tua fede con parole e melodie",
    title: "Libri e Musica per",
    titleHighlight: "Illuminare",
    subtitle: "Scopri la nostra selezione curata di libri spirituali e musica cristiana. Ogni prodotto è scelto per ispirare, educare e accompagnare il tuo percorso di fede.",
    backgroundImage: "",
    stat1Value: "500+",
    stat1Label: "Titoli disponibili",
    stat2Value: "50k+",
    stat2Label: "Clienti soddisfatti",
    stat3Value: "4.9",
    stat3Label: "Valutazione media",
  },
  fonts: {
    headingFont: "Montserrat",
    bodyFont: "Open Sans",
  },
};

interface SiteSettingsState {
  settings: SiteSettings;
  updateBrand: (brand: Partial<BrandSettings>) => void;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateSocial: (social: SocialLink[]) => void;
  updateHero: (hero: Partial<HeroContent>) => void;
  updateFonts: (fonts: Partial<FontSettings>) => void;
  resetToDefaults: () => void;
}

export const useSiteSettings = create<SiteSettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateBrand: (brand) =>
        set((state) => ({
          settings: { ...state.settings, brand: { ...state.settings.brand, ...brand } },
        })),
      updateContact: (contact) =>
        set((state) => ({
          settings: { ...state.settings, contact: { ...state.settings.contact, ...contact } },
        })),
      updateSocial: (social) =>
        set((state) => ({
          settings: { ...state.settings, social },
        })),
      updateHero: (hero) =>
        set((state) => ({
          settings: { ...state.settings, hero: { ...state.settings.hero, ...hero } },
        })),
      updateFonts: (fonts) =>
        set((state) => ({
          settings: { ...state.settings, fonts: { ...state.settings.fonts, ...fonts } },
        })),
      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'luce-divina-site-settings',
    }
  )
);
