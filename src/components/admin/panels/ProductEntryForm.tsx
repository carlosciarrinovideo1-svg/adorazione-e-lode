"use client";

import React from "react";
import { Loader2, Search, Music, BookOpen, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  const isMusic = form.tipo === "musica";

  return (
    <div className="border border-border rounded-lg p-5 mb-6 space-y-6 bg-muted/50">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          {isEditing ? "Modifica Prodotto" : "Nuovo Prodotto"}
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold",
            isMusic ? "bg-sky/20 text-sky-700" : "bg-olive/20 text-olive-700"
          )}>
            {isMusic ? "MUSICA / SOCIAL" : "LIBRO / CARTACEO"}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Link Section */}
        <div className="space-y-2 md:col-span-2 bg-card p-4 rounded-lg border border-border/50">
          <Label className="flex items-center gap-2">
            {isMusic ? <Youtube className="h-4 w-4 text-red-600" /> : <Globe className="h-4 w-4 text-primary" />}
            Link Sorgente (Amazon, YouTube, Spotify, ecc.) *
          </Label>
          <div className="flex gap-2">
            <Input
              value={form.url_originale}
              onChange={(e) => setForm({ ...form, url_originale: e.target.value })}
              placeholder={isMusic ? "Incolla link YouTube o Spotify..." : "Incolla link Amazon o IBS..."}
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
          <p className="text-[11px] text-muted-foreground">
            {isMusic 
              ? "Per YouTube recuperiamo automaticamente la copertina in alta risoluzione e il nome del canale."
              : "Per i libri recuperiamo titolo, autore, descrizione e immagine di copertina."}
          </p>
        </div>

        {/* Basic Info */}
        <div className="space-y-2">
          <Label>Tipo Prodotto</Label>
          <Select value={form.tipo} onValueChange={(v: string) => setForm({ ...form, tipo: v as "libro" | "musica" })}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                {isMusic ? <Music className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="libro">Libro / Testo</SelectItem>
              <SelectItem value="musica">Musica / Video / Social</SelectItem>
            </SelectContent>
          </Select>
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
          <Label>{isMusic ? "Artista / Canale" : "Autore"}</Label>
          <Input
            value={form.autore_artista}
            onChange={(e) => setForm({ ...form, autore_artista: e.target.value })}
            placeholder={isMusic ? "Nome artista o canale YouTube" : "Nome autore"}
          />
        </div>

        <div className="space-y-2">
          <Label>Prezzo (€)</Label>
          <Input
            type="number"
            step="0.01"
            value={form.prezzo || ""}
            onChange={(e) => setForm({ ...form, prezzo: parseFloat(e.target.value) || 0 })}
            placeholder="0.00 (lascia 0 se gratuito)"
          />
        </div>

        <div className="space-y-2">
          <Label>{isMusic ? "Piattaforma / Formato" : "Formato"}</Label>
          <Input
            value={form.formato}
            onChange={(e) => setForm({ ...form, formato: e.target.value })}
            placeholder={isMusic ? "YouTube, Spotify, CD, MP3..." : "Cartaceo, eBook..."}
          />
        </div>

        <div className="space-y-2">
          <Label>{isMusic ? "ID Video / Codice" : "ISBN / ASIN"}</Label>
          <Input
            value={form.ISBN_ASIN}
            onChange={(e) => setForm({ ...form, ISBN_ASIN: e.target.value })}
            placeholder="Codice identificativo"
          />
        </div>

        {/* Media & Description */}
        <div className="space-y-2 md:col-span-2">
          <Label>URL Immagine Copertina (Alta Risoluzione)</Label>
          <Input
            value={form.immagini[0]}
            onChange={(e) => setForm({ ...form, immagini: [e.target.value] })}
            placeholder="https://... (URL immagine)"
          />
          {form.immagini[0] && (
            <div className="mt-2 relative w-40 aspect-[3/4] rounded-lg overflow-hidden border shadow-sm">
              <img src={form.immagini[0]} alt="Anteprima" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white p-1 text-center">
                Anteprima Copertina
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Descrizione / Note</Label>
          <Textarea
            value={form.descrizione}
            onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
            placeholder="Descrizione del prodotto o del video..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Categorie (separate da virgola)</Label>
          <Input
            value={categorieInput}
            onChange={(e) => setCategorieInput(e.target.value)}
            placeholder="Worship, Testimonianza, ..."
          />
        </div>

        <div className="space-y-2">
          <Label>Tag (separati da virgola)</Label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="ispirazione, lode, ..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border/50">
        <Button onClick={onSubmit} className="flex-1 md:flex-none">
          {isEditing ? "Salva Modifiche" : "Aggiungi al Catalogo"}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1 md:flex-none">
          Annulla
        </Button>
      </div>
    </div>
  );
}