import { Link } from "react-router-dom";
import { BookOpen, Music, Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  X: Twitter,
};

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gradient-golden rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">
                  {settings.brand.logoText}
                </span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-background">
                  {settings.brand.siteName}
                </h3>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Il tuo punto di riferimento per libri e musica cristiana. 
              Ispiriamo la fede attraverso parole e melodie.
            </p>
            <div className="flex items-center gap-2 text-gold">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Con amore, per la tua fede</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {settings.social
                .filter((s) => s.enabled && s.url)
                .map((social) => {
                  const IconComponent = socialIcons[social.name];
                  return IconComponent ? (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-gold hover:text-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  ) : null;
                })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Navigazione</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/catalogo?tipo=libro" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <BookOpen className="h-4 w-4" />
                  Libri
                </Link>
              </li>
              <li>
                <Link to="/catalogo?tipo=musica" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <Music className="h-4 w-4" />
                  Musica
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-background/70 hover:text-gold transition-colors text-sm">
                  Tutto il Catalogo
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Supporto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-background/70 hover:text-gold transition-colors text-sm">
                  Centro Assistenza
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-gold transition-colors text-sm">
                  Spedizioni e Resi
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-gold transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-gold transition-colors text-sm">
                  Termini e Condizioni
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-background mb-4">Contatti</h4>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <Mail className="h-4 w-4" />
                  {settings.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  {settings.contact.phone}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-background/70 text-sm">
                  <MapPin className="h-4 w-4" />
                  {settings.contact.address}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {settings.brand.siteName}. Tutti i diritti riservati.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-background/50 text-sm italic">
                "{settings.brand.footerQuote}" - {settings.brand.footerQuoteSource}
              </p>
              <Link to="/admin" className="text-background/30 hover:text-gold transition-colors text-xs">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
