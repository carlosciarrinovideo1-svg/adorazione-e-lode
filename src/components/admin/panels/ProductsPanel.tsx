import { useState } from "react";
import { Plus, Trash2, ExternalLink, Package, Pencil, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductStore } from "@/hooks/useProductStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/mockData";

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
  categorie: [],
  tag: [],
  inventario: 1,
  stato: "in stock",
  data_aggiornamento: new Date().toISOString().split("T")[0],
};

function ProductForm({
  form,
  setForm,
  categorieInput,
  setCategorieInput,
  tagInput,
  setTagInput,
  onSubmit,
  onCancel,
  isEditing,
  isFetching,
  onFetchMeta,
}: {
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  categorieInput: string;
  setCategorieInput: (s: string) => void;
  tagInput: string;
  setTagInput: (s: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isFetching: boolean;
  onFetchMeta: () => void;
}) {
  return (
    <div className="border border-border rounded-lg p-5 mb-6 space-y-4 bg-muted/50">
      <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {isEditing ? "Modifica Prodotto" : "Nuovo Prodotto da Link Esterno"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Link Esterno (es. Amazon) *</Label>
          <div className="flex gap-2">
            <Input
              value={form.url_originale}
              onChange={(e) => setForm({ ...form, url_originale: e.target.value })}
              placeholder="https://amazon.it/dp/..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={onFetchMeta}
              disabled={isFetching || !form.url_originale}
            >
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">
                {isFetching ? "Recupero..." : "Recupera dati"}
              </span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Inserisci il link e clicca "Recupera dati" per compilare automaticamente i campi
          </p>
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
          {form.immagini[0] && (
            <img src={form.immagini[0]} alt="Anteprima" className="w-20 h-20 rounded object-cover mt-2 border" />
          )}
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
        <Button onClick={onSubmit}>
          {isEditing ? "Salva Modifiche" : "Aggiungi al Catalogo"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Annulla</Button>
      </div>
    </div>
  );
}

export function ProductsPanel() {
  const { products, addProduct, removeProduct, updateProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({ ...emptyProduct });
  const [categorieInput, setCategorieInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const resetForm = () => {
    setForm({ ...emptyProduct });
    setCategorieInput("");
    setTagInput("");
    setShowForm(false);
    setEditingId(null);
  };

  const handleFetchMeta = async () => {
    if (!form.url_originale) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-meta', {
        body: { url: form.url_originale },
      });
      if (error) throw error;
      if (data) {
        setForm((prev) => ({
          ...prev,
          titolo: data.titolo || prev.titolo,
          descrizione: data.descrizione || prev.descrizione,
          immagini: data.immagine ? [data.immagine] : prev.immagini,
          prezzo: data.prezzo || prev.prezzo,
          autore_artista: data.autore || prev.autore_artista,
          ISBN_ASIN: data.isbn || prev.ISBN_ASIN,
        }));
        toast.success("Dati recuperati! Puoi modificarli prima di salvare.");
      }
    } catch (e) {
      console.error('Fetch meta error:', e);
      toast.error("Impossibile recuperare i dati. Inseriscili manualmente.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = () => {
    if (!form.titolo || !form.url_originale) {
      toast.error("Inserisci almeno il titolo e il link del prodotto");
      return;
    }
    const categorie = categorieInput.split(",").map((s) => s.trim()).filter(Boolean);
    const tag = tagInput.split(",").map((s) => s.trim()).filter(Boolean);
    const immagini = form.immagini.filter(Boolean);

    if (editingId) {
      updateProduct(editingId, { ...form, categorie, tag, immagini });
      toast.success("Prodotto aggiornato!");
    } else {
      addProduct({ ...form, id: crypto.randomUUID(), categorie, tag, immagini });
      toast.success("Prodotto aggiunto!");
    }
    resetForm();
  };

  const handleEdit = (p: Product) => {
    setForm({
      tipo: p.tipo,
      titolo: p.titolo,
      autore_artista: p.autore_artista,
      ISBN_ASIN: p.ISBN_ASIN,
      prezzo: p.prezzo,
      lingua: p.lingua,
      formato: p.formato,
      descrizione: p.descrizione,
      immagini: [...p.immagini],
      url_originale: p.url_originale,
      categorie: p.categorie,
      tag: p.tag,
      inventario: p.inventario,
      stato: p.stato,
      data_aggiornamento: p.data_aggiornamento,
    });
    setCategorieInput(p.categorie.join(", "));
    setTagInput(p.tag.join(", "));
    setEditingId(p.id);
    setShowForm(true);
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
          {!showForm && (
            <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Prodotto
            </Button>
          )}
        </div>

        {showForm && (
          <ProductForm
            form={form}
            setForm={setForm}
            categorieInput={categorieInput}
            setCategorieInput={setCategorieInput}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingId}
            isFetching={isFetching}
            onFetchMeta={handleFetchMeta}
          />
        )}

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
              <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
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
