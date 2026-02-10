import { useState } from "react";
import { Plus, Trash2, ExternalLink, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductStore } from "@/hooks/useProductStore";
import { toast } from "sonner";

interface ProductForm {
  tipo: "libro" | "musica";
  titolo: string;
  autore_artista: string;
  ISBN_ASIN: string;
  prezzo: number;
  lingua: string;
  formato: string;
  descrizione: string;
  immagini: string[];
  url_originale: string;
  categorie: string[];
  tag: string[];
  inventario: number;
  stato: "in stock" | "esaurito";
  data_aggiornamento: string;
}

const emptyProduct: ProductForm = {
  tipo: "libro",
  titolo: "",
  autore_artista: "",
  ISBN_ASIN: "",
  prezzo: 0,
  lingua: "Italiano",
  formato: "Cartaceo",
  descrizione: "",
  immagini: [""],
  url_originale: "",
  categorie: [] as string[],
  tag: [] as string[],
  inventario: 1,
  stato: "in stock" as const,
  data_aggiornamento: new Date().toISOString().split("T")[0],
};

export function ProductsPanel() {
  const { products, addProduct, removeProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyProduct>(({ ...emptyProduct }));
  const [categorieInput, setCategorieInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleAdd = () => {
    if (!form.titolo || !form.url_originale) {
      toast.error("Inserisci almeno il titolo e il link del prodotto");
      return;
    }
    const newProduct = {
      ...form,
      id: crypto.randomUUID(),
      categorie: categorieInput.split(",").map((s) => s.trim()).filter(Boolean),
      tag: tagInput.split(",").map((s) => s.trim()).filter(Boolean),
      immagini: form.immagini.filter(Boolean),
    };
    addProduct(newProduct);
    setForm({ ...emptyProduct });
    setCategorieInput("");
    setTagInput("");
    setShowForm(false);
    toast.success("Prodotto aggiunto con successo!");
  };

  const handleRemove = (id: string, titolo: string) => {
    if (confirm(`Rimuovere "${titolo}" dal catalogo?`)) {
      removeProduct(id);
      toast.success("Prodotto rimosso");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-lg">Gestione Prodotti</h2>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Prodotto
          </Button>
        </div>

        {showForm && (
          <div className="border border-border rounded-lg p-5 mb-6 space-y-4 bg-muted/50">
            <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Nuovo Prodotto da Link Esterno
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Link Esterno (es. Amazon) *</Label>
                <Input
                  value={form.url_originale}
                  onChange={(e) => setForm({ ...form, url_originale: e.target.value })}
                  placeholder="https://amazon.it/dp/..."
                />
              </div>

              <div className="space-y-2">
                <Label>Titolo *</Label>
                <Input
                  value={form.titolo}
                  onChange={(e) => setForm({ ...form, titolo: e.target.value })}
                  placeholder="Titolo del prodotto"
                />
              </div>

              <div className="space-y-2">
                <Label>Autore / Artista</Label>
                <Input
                  value={form.autore_artista}
                  onChange={(e) => setForm({ ...form, autore_artista: e.target.value })}
                  placeholder="Nome autore o artista"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v: string) => setForm({ ...form, tipo: v as "libro" | "musica" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="libro">Libro</SelectItem>
                    <SelectItem value="musica">Musica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prezzo (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.prezzo || ""}
                  onChange={(e) => setForm({ ...form, prezzo: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>ISBN / ASIN</Label>
                <Input
                  value={form.ISBN_ASIN}
                  onChange={(e) => setForm({ ...form, ISBN_ASIN: e.target.value })}
                  placeholder="Codice identificativo"
                />
              </div>

              <div className="space-y-2">
                <Label>Formato</Label>
                <Input
                  value={form.formato}
                  onChange={(e) => setForm({ ...form, formato: e.target.value })}
                  placeholder="Cartaceo, eBook, CD, MP3..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>URL Immagine</Label>
                <Input
                  value={form.immagini[0]}
                  onChange={(e) => setForm({ ...form, immagini: [e.target.value] })}
                  placeholder="https://... (URL immagine del prodotto)"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Descrizione</Label>
                <Textarea
                  value={form.descrizione}
                  onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
                  placeholder="Descrizione del prodotto"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Categorie (separate da virgola)</Label>
                <Input
                  value={categorieInput}
                  onChange={(e) => setCategorieInput(e.target.value)}
                  placeholder="Spiritualità, Fede, ..."
                />
              </div>

              <div className="space-y-2">
                <Label>Tag (separati da virgola)</Label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="ispirazione, preghiera, ..."
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd}>Aggiungi al Catalogo</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Annulla</Button>
            </div>
          </div>
        )}

        {/* Product list */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{products.length} prodotti nel catalogo</p>
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background">
              {p.immagini[0] && (
                <img src={p.immagini[0]} alt={p.titolo} className="w-12 h-12 rounded object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.titolo}</p>
                <p className="text-xs text-muted-foreground">{p.autore_artista} · €{p.prezzo.toFixed(2)} · {p.tipo}</p>
              </div>
              {p.url_originale && (
                <a href={p.url_originale} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <Button variant="ghost" size="icon" onClick={() => handleRemove(p.id, p.titolo)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
