import { motion } from "framer-motion";
import { inspirationalQuotes } from "@/lib/mockData";
import { useProductStore } from "@/hooks/useProductStore";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Quote } from "lucide-react";

export function FeaturedProducts() {
  const { products } = useProductStore();
  const featuredProducts = products.slice(0, 4);
  const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16 p-8 bg-gradient-divine rounded-3xl border border-border/50"
        >
          <Quote className="h-10 w-10 text-primary/30 mx-auto mb-4" />
          <blockquote className="font-heading text-2xl lg:text-3xl font-medium text-foreground italic mb-4">
            "{randomQuote.text}"
          </blockquote>
          <cite className="text-primary font-semibold">— {randomQuote.source}</cite>
        </motion.div>

        {/* Featured Products */}
        <ProductGrid
          products={featuredProducts}
          title="Prodotti in Evidenza"
          subtitle="I titoli più amati dalla nostra comunità"
        />
      </div>
    </section>
  );
}
