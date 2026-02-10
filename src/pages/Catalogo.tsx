import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List, BookOpen, Music } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProductStore } from "@/hooks/useProductStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { products } = useProductStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const tipo = searchParams.get("tipo") || "tutti";
  const sortBy = searchParams.get("sort") || "rilevanza";

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by type
    if (tipo === "libro") {
      result = result.filter((p) => p.tipo === "libro");
    } else if (tipo === "musica") {
      result = result.filter((p) => p.tipo === "musica");
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.titolo.toLowerCase().includes(term) ||
          p.autore_artista.toLowerCase().includes(term) ||
          p.descrizione.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortBy) {
      case "prezzo-asc":
        result = [...result].sort((a, b) => a.prezzo - b.prezzo);
        break;
      case "prezzo-desc":
        result = [...result].sort((a, b) => b.prezzo - a.prezzo);
        break;
      case "nome":
        result = [...result].sort((a, b) => a.titolo.localeCompare(b.titolo));
        break;
      case "valutazione":
        result = [...result].sort(
          (a, b) => (b.valutazione || 0) - (a.valutazione || 0)
        );
        break;
    }

    return result;
  }, [tipo, searchTerm, sortBy]);

  const handleTypeChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "tutti") {
      newParams.delete("tipo");
    } else {
      newParams.set("tipo", value);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "rilevanza") {
      newParams.delete("sort");
    } else {
      newParams.set("sort", value);
    }
    setSearchParams(newParams);
  };

  return (
    <Layout>
      <div className="bg-gradient-divine py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {tipo === "libro"
                ? "Libri Cristiani"
                : tipo === "musica"
                ? "Musica Cristiana"
                : "Tutto il Catalogo"}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} prodotti disponibili
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card rounded-2xl p-4 shadow-card border border-border/50">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca titolo, autore..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Type Filter */}
              <div className="flex gap-2">
                <Button
                  variant={tipo === "tutti" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeChange("tutti")}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Tutti
                </Button>
                <Button
                  variant={tipo === "libro" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeChange("libro")}
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Libri
                </Button>
                <Button
                  variant={tipo === "musica" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeChange("musica")}
                >
                  <Music className="h-4 w-4 mr-1" />
                  Musica
                </Button>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordina per" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rilevanza">Rilevanza</SelectItem>
                  <SelectItem value="prezzo-asc">Prezzo: basso-alto</SelectItem>
                  <SelectItem value="prezzo-desc">Prezzo: alto-basso</SelectItem>
                  <SelectItem value="nome">Nome A-Z</SelectItem>
                  <SelectItem value="valutazione">Valutazione</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden lg:flex gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "muted" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "muted" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 pb-16">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nessun prodotto trovato per "{searchTerm}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Cancella ricerca
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalogo;
