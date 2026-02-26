// Supabase Edge Function: Scrape Metadata
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log("[scrape-meta] Fetching:", formattedUrl);

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    // Se il fetch fallisce, restituiamo comunque un oggetto vuoto invece di un errore 500
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        titolo: '', descrizione: '', immagine: '', prezzo: null, autore: '', isbn: '' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    const getMeta = (property: string): string => {
      const patterns = [
        new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1];
      }
      return '';
    };

    let titolo = getMeta('og:title') || getMeta('twitter:title') || (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim();
    let immagine = getMeta('og:image') || getMeta('twitter:image');
    let descrizione = getMeta('og:description') || getMeta('description');
    let autore = getMeta('author') || '';

    // Pulizia immagine Amazon per alta risoluzione
    if (formattedUrl.includes('amazon') && immagine) {
      immagine = immagine.replace(/\._[A-Z0-9,]+_\./i, '.');
    }

    // Gestione YouTube avanzata
    if (formattedUrl.includes('youtube.com') || formattedUrl.includes('youtu.be')) {
      // Se non abbiamo l'immagine og:image, proviamo a ricostruirla dall'ID video
      if (!immagine) {
        const videoIdMatch = formattedUrl.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|\/shorts\/|watch\?.*v=)([^#\&\?]*).*/);
        if (videoIdMatch && videoIdMatch[1]) {
          immagine = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      } else if (immagine.includes('hqdefault.jpg')) {
        immagine = immagine.replace('hqdefault.jpg', 'maxresdefault.jpg');
      }
      
      const channelMatch = html.match(/"author":"([^"]+)"/i);
      if (channelMatch?.[1]) autore = channelMatch[1];
    }

    return new Response(JSON.stringify({
      titolo: titolo || '',
      descrizione: descrizione || '',
      immagine: immagine || '',
      prezzo: null,
      autore: autore || '',
      isbn: getMeta('og:isbn') || (html.match(/(?:ISBN|ASIN)[:\s]*([0-9X-]{10,17})/i)?.[1] || ''),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error("[scrape-meta] Error:", e);
    return new Response(JSON.stringify({ error: 'Scrape error' }), {
      status: 200, // Restituiamo 200 per non bloccare il client
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});