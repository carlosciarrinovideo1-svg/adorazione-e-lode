import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { Save, Mail, Phone, MapPin } from "lucide-react";

export function ContactSettingsPanel() {
  const { settings, updateContact } = useSiteSettings();
  const [formData, setFormData] = useState(settings.contact);

  useEffect(() => {
    setFormData(settings.contact);
  }, [settings.contact]);

  const handleSave = () => {
    updateContact(formData);
    toast.success("Informazioni di contatto salvate");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informazioni di Contatto</CardTitle>
        <CardDescription>
          Modifica i dati di contatto visualizzati nel footer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="info@tuosito.it"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefono
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+39 012 345 6789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Indirizzo
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Città, Paese"
          />
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Salva Modifiche
        </Button>
      </CardContent>
    </Card>
  );
}
