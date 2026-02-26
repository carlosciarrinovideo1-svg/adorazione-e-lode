import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/mockData";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`"${product.titolo}" aggiunto al carrello!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/prodotto/${product.id}`}>
        <article className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border/50">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={product.immagini[0]}
              alt={product.titolo}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                product.tipo === "libro" 
                  ? "bg-olive/90 text-olive-foreground" 
                  : "bg-sky/90 text-accent-foreground"
              }`}>
                {product.tipo === "libro" ? (
                  <BookOpen className="h-3 w-3" />
                ) : (
                  <Music className="h-3 w-3" />
                )}
                {product.tipo === "libro" ? "Libro" : "Musica"}
              </span>
            </div>
            {/* Quick Add */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                Aggiungi
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-5">
            {/* Rating */}
            {product.valutazione && (
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{product.valutazione}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.recensioni} recensioni)
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {product.titolo}
            </h3>

            {/* Author */}
            <p className="text-sm text-muted-foreground mb-3">
              {product.autore_artista}
            </p>

            {/* Price & Format */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-heading font-bold text-primary">
                  {product.prezzo !== null && product.prezzo !== undefined 
                    ? `€${product.prezzo.toFixed(2)}` 
                    : "Gratis"}
                </p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {product.formato}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}