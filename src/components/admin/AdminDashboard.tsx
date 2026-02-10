import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  LogOut, 
  Image, 
  Type, 
  Mail, 
  Share2, 
  Home,
  Shield,
  RotateCcw,
  ArrowLeft,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { BrandSettingsPanel } from "./panels/BrandSettingsPanel";
import { ContactSettingsPanel } from "./panels/ContactSettingsPanel";
import { SocialSettingsPanel } from "./panels/SocialSettingsPanel";
import { HeroSettingsPanel } from "./panels/HeroSettingsPanel";
import { SecuritySettingsPanel } from "./panels/SecuritySettingsPanel";
import { ProductsPanel } from "./panels/ProductsPanel";

export function AdminDashboard() {
  const { logout } = useAdminAuth();
  const { resetToDefaults } = useSiteSettings();
  const [activeTab, setActiveTab] = useState("brand");

  const handleLogout = () => {
    logout();
    toast.success("Disconnesso con successo");
  };

  const handleReset = () => {
    if (confirm("Sei sicuro di voler ripristinare tutte le impostazioni predefinite?")) {
      resetToDefaults();
      toast.success("Impostazioni ripristinate");
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-golden rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg">Pannello Admin</h1>
                <p className="text-xs text-muted-foreground">Gestione Sito</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-2 bg-card">
              <TabsTrigger value="brand" className="flex items-center gap-2 py-3">
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Brand</span>
              </TabsTrigger>
              <TabsTrigger value="hero" className="flex items-center gap-2 py-3">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Hero</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2 py-3">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Contatti</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2 py-3">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 py-3">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Sicurezza</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brand">
              <BrandSettingsPanel />
            </TabsContent>

            <TabsContent value="hero">
              <HeroSettingsPanel />
            </TabsContent>

            <TabsContent value="contact">
              <ContactSettingsPanel />
            </TabsContent>

            <TabsContent value="social">
              <SocialSettingsPanel />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettingsPanel />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
