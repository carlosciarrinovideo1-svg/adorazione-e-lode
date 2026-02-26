import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Heart,
  Share2,
  BookOpen,
  Music,
  ExternalLink,
  Check,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inspirationalQuotes } from "@/lib/mockData";
import { useProductStore } from "@/hooks/useProductStore";
import { useCart } from "@/hooks/useCart";
import { ProductGrid } from "@/components/products/ProductGrid";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { products } = useProductStore();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products
    .filter((p) => p.id !== id && p.tipo === product?.tipo)
    .slice(0, 4);
  const randomQuote =
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">
            Prodotto non trovato
          </h1>
          <Link to="/catalogo">
            <Button>Torna al catalogo</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`"${product.titolo}" aggiunto al carrello!`);
  };

  const getExternalLinkText = (url: string) => {
    if (!url) return "Vedi Fonte";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("amazon")) return "Vedi su Amazon";
    if (lowerUrl.includes("youtube") || lowerUrl.includes("youtu.be")) return "Vedi su YouTube";
    if (lowerUrl.includes("spotify")) return "Ascolta su Spotify";
    if (lowerUrl.includes("ibs.it")) return "Vedi su IBS";
    if (lowerUrl.includes("feltrinelli")) return "Vedi su La Feltrinelli";
    return "Vedi Fonte Originale";
  };

  return (
    <Layout>
      <div className="bg-muted/50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna al catalogo
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-muted rounded-3xl overflow-hidden shadow-soft">
              <img
                src={product.immagini[0]}
                alt={product.titolo}
                className="w-full h-full object-cover"
              />
            </div>
            <Badge
              className={`absolute top-4 left-4 ${
                product.tipo === "libro" ? "bg-olive" : "bg-sky"
              }`}
            >
              {product.tipo === "libro" ? (
                <BookOpen className="h-3 w-3 mr-1" />
              ) : (
                <Music className="h-3 w-3 mr-1" />
              )}
              {product.tipo === "libro" ? "Libro" : "Musica"}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {product.valutazione && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.valutazione!)
                          ? "fill-primary text-primary"
                          : "text-border"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.valutazione}</span>
                <span className="text-muted-foreground">
                  ({product.recensioni} recensioni)
                </span>
              </div>
            )}

            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {product.titolo}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              di{" "}
              <span className="text-foreground font-medium">
                {product.autore_artista}
              </span>
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-4xl font-bold text-primary">
                €{product.prezzo.toFixed(2)}
              </span>
              {product.stato === "in stock" && (
                <span className="inline-flex items-center gap-1 text-sm text-olive">
                  <Check className="h-4 w-4" />
                  Disponibile
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">{product.formato}</Badge>
              <Badge variant="outline">{product.lingua}</Badge>
              {product.categorie.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.descrizione}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                variant="hero"
                size="xl"
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none"
              >
                <ShoppingCart className="h-5 w-5" />
                Aggiungi al Carrello
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <a
              href={product.url_originale}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {getExternalLinkText(product.url_originale)}
            </a>

            <div className="mt-auto pt-8 border-t border-border mt-8">
              <blockquote className="italic text-muted-foreground">
                "{randomQuote.text}"
                <cite className="block mt-2 text-primary font-medium not-italic">
                  — {randomQuote.source}
                </cite>
              </blockquote>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <ProductGrid
              products={relatedProducts}
              title="Prodotti Correlati"
              subtitle="Altri titoli che potrebbero interessarti"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;