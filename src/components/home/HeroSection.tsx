import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              ✝️ Nutri la tua fede con parole e melodie
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Libri e Musica per{" "}
            <span className="text-gradient-gold">Illuminare</span> il Tuo Cammino
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 leading-relaxed"
          >
            Scopri la nostra selezione curata di libri spirituali e musica cristiana. 
            Ogni prodotto è scelto per ispirare, educare e accompagnare il tuo percorso di fede.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/catalogo">
              <Button variant="hero" size="xl">
                Esplora il Catalogo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/catalogo?tipo=libro">
              <Button variant="outline" size="xl">
                <BookOpen className="h-5 w-5" />
                Libri
              </Button>
            </Link>
            <Link to="/catalogo?tipo=musica">
              <Button variant="outline" size="xl">
                <Music className="h-5 w-5" />
                Musica
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-8 mt-12 pt-8 border-t border-border/50"
          >
            <div>
              <p className="font-heading text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Titoli disponibili</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">50k+</p>
              <p className="text-sm text-muted-foreground">Clienti soddisfatti</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">Valutazione media</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
