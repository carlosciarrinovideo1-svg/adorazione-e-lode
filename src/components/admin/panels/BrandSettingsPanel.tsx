import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function BrandSettingsPanel() {
  const { settings, updateBrand } = useSiteSettings();
  const [formData, setFormData] = useState(settings.brand);

  useEffect(() => {
    setFormData(settings.brand);
  }, [settings.brand]);

  const handleSave = () => {
    updateBrand(formData);
    toast.success("Impostazioni brand salvate");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impostazioni Brand</CardTitle>
        <CardDescription>
          Personalizza il nome, logo e testi del tuo sito
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="siteName">Nome Sito</Label>
            <Input
              id="siteName"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              placeholder="Nome del tuo sito"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteTagline">Sottotitolo</Label>
            <Input
              id="siteTagline"
              value={formData.siteTagline}
              onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
              placeholder="Slogan o descrizione breve"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoText">Testo Logo</Label>
          <Input
            id="logoText"
            value={formData.logoText}
            onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
            placeholder="Iniziali o testo breve per il logo"
            maxLength={4}
          />
          <p className="text-xs text-muted-foreground">Massimo 4 caratteri</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="footerQuote">Citazione Footer</Label>
            <Input
              id="footerQuote"
              value={formData.footerQuote}
              onChange={(e) => setFormData({ ...formData, footerQuote: e.target.value })}
              placeholder="Una citazione ispirazionale"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerQuoteSource">Fonte Citazione</Label>
            <Input
              id="footerQuoteSource"
              value={formData.footerQuoteSource}
              onChange={(e) => setFormData({ ...formData, footerQuoteSource: e.target.value })}
              placeholder="es. Salmo 27:1"
            />
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
