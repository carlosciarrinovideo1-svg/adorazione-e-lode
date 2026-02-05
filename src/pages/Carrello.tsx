import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const Carrello = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="inline-flex p-6 rounded-full bg-muted mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
              Il tuo carrello è vuoto
            </h1>
            <p className="text-muted-foreground mb-8">
              Esplora il nostro catalogo e trova qualcosa di speciale per te
            </p>
            <Link to="/catalogo">
              <Button variant="hero" size="lg">
                Esplora il Catalogo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-divine py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continua lo shopping
          </Link>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
            Il Tuo Carrello
          </h1>
          <p className="text-muted-foreground mt-2">
            {items.length} {items.length === 1 ? "articolo" : "articoli"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 lg:gap-6 bg-card rounded-2xl p-4 lg:p-6 shadow-card border border-border/50"
              >
                {/* Image */}
                <Link to={`/prodotto/${item.product.id}`}>
                  <div className="w-24 h-32 lg:w-32 lg:h-40 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.immagini[0]}
                      alt={item.product.titolo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <Link to={`/prodotto/${item.product.id}`}>
                    <h3 className="font-heading font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {item.product.titolo}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.product.autore_artista}
                  </p>
                  <p className="text-xs text-muted-foreground bg-muted inline-block px-2 py-1 rounded w-fit">
                    {item.product.formato}
                  </p>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-heading font-bold text-lg text-primary">
                        €{(item.product.prezzo * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Svuota carrello
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="font-heading font-bold text-xl text-foreground mb-6">
                Riepilogo Ordine
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotale</span>
                  <span className="font-medium">€{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spedizione</span>
                  <span className="font-medium text-olive">Gratuita</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="font-heading font-semibold">Totale</span>
                    <span className="font-heading font-bold text-2xl text-primary">
                      €{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="hero" size="xl" className="w-full mb-4">
                Procedi al Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Pagamento sicuro con crittografia SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Carrello;
