"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink, Package, Pencil, BookOpen, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/hooks/useProductStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/lib/mockData";
import { ProductEntryForm, ProductFormData } from "./ProductEntryForm";

const emptyProduct: ProductFormData = {
  tipo: "libro",
  titolo: "",
  autore_artista: "",
  ISBN_ASIN: "",
  prezzo: null,
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

export function ProductsPanel() {
  const { products, addProduct, removeProduct, updateProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyProduct);
  const [categorieInput, setCategorieInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const resetForm = () => {
    setForm(emptyProduct);
    setCategorieInput("");
    setTagInput("");
    setShowForm(false);
    setEditingId(null);
  };

  const startNewProduct = (tipo: "libro" | "musica") => {
    setForm({ 
      ...emptyProduct, 
      tipo, 
      formato: tipo === "musica" ? "YouTube" : "Cartaceo" 
    });
    setShowForm(true);
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
          autore_artista: data.autore || prev.autore_artista,
          ISBN_ASIN: data.isbn || prev.ISBN_ASIN,
        }));
        toast.success("Dati recuperati con successo!");
      }
    } catch (e) {
      console.error('Fetch meta error:', e);
      toast.error("Impossibile recuperare i dati automaticamente. Inseriscili manualmente.");
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
      prezzo: p.prezzo || null,
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

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-lg">Gestione Catalogo</h2>
          </div>
          {!showForm && (
            <div className="flex gap-2">
              <Button onClick={() => startNewProduct("libro")} size="sm" variant="outline" className="border-olive/50 text-olive hover:bg-olive/10">
                <BookOpen className="h-4 w-4 mr-2" />
                Aggiungi Libro
              </Button>
              <Button onClick={() => startNewProduct("musica")} size="sm" variant="outline" className="border-sky/50 text-sky-700 hover:bg-sky/10">
                <Music className="h-4 w-4 mr-2" />
                Aggiungi Musica/Social
              </Button>
            </div>
          )}
        </div>

        {showForm && (
          <ProductEntryForm
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
          <div className="flex items-center justify-between border-b pb-2">
            <p className="text-sm font-medium text-muted-foreground">Prodotti in Catalogo ({products.length})</p>
          </div>
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-background hover:shadow-sm transition-shadow">
              {p.immagini[0] && (
                <img src={p.immagini[0]} alt={p.titolo} className="w-12 h-16 rounded object-cover border" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm truncate">{p.titolo}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${p.tipo === 'libro' ? 'bg-olive/10 text-olive' : 'bg-sky/10 text-sky-700'}`}>
                    {p.tipo}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{p.autore_artista} · {p.prezzo ? `€${p.prezzo.toFixed(2)}` : 'Gratis'}</p>
              </div>
              <div className="flex items-center gap-1">
                {p.url_originale && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={p.url_originale} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  if (confirm(`Rimuovere "${p.titolo}"?`)) removeProduct(p.id);
                }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}