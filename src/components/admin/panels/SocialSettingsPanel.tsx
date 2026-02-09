import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings, SocialLink } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Save, Facebook, Instagram, Youtube, Twitter, Plus, Trash2 } from "lucide-react";

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  YouTube: Youtube,
  X: Twitter,
};

export function SocialSettingsPanel() {
  const { settings, updateSocial } = useSiteSettings();
  const [formData, setFormData] = useState<SocialLink[]>(settings.social);

  useEffect(() => {
    setFormData(settings.social);
  }, [settings.social]);

  const handleSave = () => {
    updateSocial(formData);
    toast.success("Link social salvati");
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string | boolean) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const addLink = () => {
    setFormData([...formData, { name: "Nuovo Social", url: "", enabled: true }]);
  };

  const removeLink = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Social Media</CardTitle>
        <CardDescription>
          Gestisci i collegamenti ai tuoi profili social nel footer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.map((social, index) => {
          const IconComponent = socialIcons[social.name];
          return (
            <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0 mt-2">
                {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Nome</Label>
                    <Input
                      id={`name-${index}`}
                      value={social.name}
                      onChange={(e) => updateLink(index, "name", e.target.value)}
                      placeholder="Nome social"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={social.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`enabled-${index}`}
                      checked={social.enabled}
                      onCheckedChange={(checked) => updateLink(index, "enabled", checked)}
                    />
                    <Label htmlFor={`enabled-${index}`} className="text-sm">
                      {social.enabled ? "Attivo" : "Disattivo"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <Button variant="outline" onClick={addLink} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Social
        </Button>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Salva Modifiche
        </Button>
      </CardContent>
    </Card>
  );
}
