import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Music, Heart, Users, Sparkles, Gift } from "lucide-react";

const categories = [
  {
    name: "Libri Spirituali",
    description: "Meditazioni, preghiere e studi biblici",
    icon: BookOpen,
    color: "bg-olive/10 text-olive",
    href: "/catalogo?tipo=libro",
    count: "200+"
  },
  {
    name: "Musica Worship",
    description: "Album di adorazione e lode",
    icon: Music,
    color: "bg-sky/20 text-sky-600",
    href: "/catalogo?tipo=musica",
    count: "150+"
  },
  {
    name: "Devozione",
    description: "Libri per la preghiera quotidiana",
    icon: Heart,
    color: "bg-primary/10 text-primary",
    href: "/catalogo?categoria=Devozione",
    count: "80+"
  },
  {
    name: "Famiglia",
    description: "Risorse per crescere nella fede insieme",
    icon: Users,
    color: "bg-olive-light/20 text-olive",
    href: "/catalogo?categoria=Famiglia",
    count: "60+"
  },
  {
    name: "Novità",
    description: "Gli ultimi arrivi del mese",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
    href: "/catalogo?novita=true",
    count: "Nuovi"
  },
  {
    name: "Regali",
    description: "Idee regalo per ogni occasione",
    icon: Gift,
    color: "bg-sand text-foreground",
    href: "/catalogo?regali=true",
    count: "Speciali"
  }
];

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-warmth">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Esplora le Categorie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trova esattamente ciò che cerchi per nutrire la tua fede e il tuo spirito
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.href}
                className="block group bg-card rounded-2xl p-6 text-center shadow-card card-hover border border-border/50"
              >
                <div className={`inline-flex p-4 rounded-xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1 text-sm lg:text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 hidden lg:block">
                  {category.description}
                </p>
                <span className="text-xs font-medium text-primary">
                  {category.count}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
