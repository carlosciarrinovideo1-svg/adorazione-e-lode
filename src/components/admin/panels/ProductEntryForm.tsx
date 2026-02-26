"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface ProductFormData {
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

interface ProductEntryFormProps {
  form: ProductFormData;
  setForm: (f: ProductFormData) => void;
  categorieInput: string;
  setCategorieInput: (s: string) => void;
  tagInput: string;
  setTagInput: (s: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isFetching: boolean;
  onFetchMeta: () => void;
}

export function ProductEntryForm({
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
}: ProductEntryFormProps) {
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