"use client";

import React, { useState } from "react";
import { Upload, Loader2, X, FileImage, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  label?: string;
  folder?: string;
}

export function FileUploader({ 
  onUploadComplete, 
  accept = "image/*,video/*", 
  label = "Carica file",
  folder = "products"
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('public_assets') // Assicurati che questo bucket esista su Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public_assets')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast.success("File caricato con successo!");
    } catch (error: any) {
      console.error("Errore caricamento:", error);
      toast.error("Errore durante il caricamento: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={accept}
        onChange={handleUpload}
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 h-20 flex flex-col gap-2 hover:bg-muted/50"
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
        <span className="text-xs font-medium">
          {isUploading ? "Caricamento in corso..." : label}
        </span>
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        Supporta immagini (JPG, PNG) e video (MP4)
      </p>
    </div>
  );
}