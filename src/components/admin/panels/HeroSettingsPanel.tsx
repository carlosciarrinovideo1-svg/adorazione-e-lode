import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Save, Image, ExternalLink } from "lucide-react";
import { FileUploader } from "../FileUploader";

export function HeroSettingsPanel() {
  const { settings, updateHero } = useSiteSettings();
  const [formData, setFormData] = useState(settings.hero);

  useEffect(() => {
    setFormData(settings.hero);
  }, [settings.hero]);

  const handleSave = () => {
    updateHero(formData);
    toast.success("Impostazioni hero salvate");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sezione Hero (Homepage)</CardTitle>
        <CardDescription>
          Personalizza il contenuto principale della homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="badge">Badge/Etichetta</Label>
          <Input
            id="badge"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            placeholder="✝️ Testo badge..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo (prima parte)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Libri e Musica per"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleHighlight">Parola Evidenziata (oro)</Label>
            <Input
              id="titleHighlight"
              value={formData.titleHighlight}
              onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
              placeholder="Illuminare"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Sottotitolo</Label>
          <Textarea
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Descrizione della sezione hero..."
            rows={3}
          />
        </div>

        <div className="space-y-4 border-t pt-4">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Immagine di Sfondo
          </Label>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Carica nuova immagine:</Label>
              <FileUploader 
                label="Carica Sfondo" 
                accept="image/*"
                folder="hero"
                onUploadComplete={(url) => setFormData({ ...formData, backgroundImage: url })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Oppure inserisci URL:</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundImage"
                  value={formData.backgroundImage}
                  onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                  placeholder="https://esempio.com/immagine.jpg"
                />
                {formData.backgroundImage && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={formData.backgroundImage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {formData.backgroundImage && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-2 text-muted-foreground">Anteprima Sfondo:</p>
              <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-muted">
                <img 
                  src={formData.backgroundImage} 
                  alt="Anteprima" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="border-t pt-6">
          <h3 className="font-heading font-semibold mb-4">Statistiche</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Statistica 1</Label>
              <Input
                value={formData.stat1Value}
                onChange={(e) => setFormData({ ...formData, stat1Value: e.target.value })}
                placeholder="500+"
              />
              <Input
                value={formData.stat1Label}
                onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                placeholder="Titoli disponibili"
              />
            </div>
            <div className="space-y-2">
              <Label>Statistica 2</Label>
              <Input
                value={formData.stat2Value}
                onChange={(e) => setFormData({ ...formData, stat2Value: e.target.value })}
                placeholder="50k+"
              />
              <Input
                value={formData.stat2Label}
                onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                placeholder="Clienti soddisfatti"
              />
            </div>
            <div className="space-y-2">
              <Label>Statistica 3</Label>
              <Input
                value={formData.stat3Value}
                onChange={(e) => setFormData({ ...formData, stat3Value: e.target.value })}
                placeholder="4.9"
              />
              <Input
                value={formData.stat3Label}
                onChange={(e) => setFormData({ ...formData, stat3Label: e.target.value })}
                placeholder="Valutazione media"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Salva Modifiche
        </Button>
      </CardContent>
    </Card>
  );
}