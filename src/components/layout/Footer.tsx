import { Link } from "react-router-dom";
import { BookOpen, Music, Heart, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gradient-golden rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">LD</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-background">Luce Divina</h3>
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
                <a href="mailto:info@lucedivina.it" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <Mail className="h-4 w-4" />
                  info@lucedivina.it
                </a>
              </li>
              <li>
                <a href="tel:+390123456789" className="flex items-center gap-2 text-background/70 hover:text-gold transition-colors text-sm">
                  <Phone className="h-4 w-4" />
                  +39 012 345 6789
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-background/70 text-sm">
                  <MapPin className="h-4 w-4" />
                  Roma, Italia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Luce Divina. Tutti i diritti riservati.
            </p>
            <p className="text-background/50 text-sm italic">
              "Il Signore è la mia luce e la mia salvezza" - Salmo 27:1
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
