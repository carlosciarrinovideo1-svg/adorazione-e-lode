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

    // Gestione YouTube avanzata per Autore/Canale
    if (formattedUrl.includes('youtube.com') || formattedUrl.includes('youtu.be')) {
      // 1. Prova con il meta tag author (spesso presente)
      if (!autore) autore = getMeta('author');
      
      // 2. Prova a cercare il nome del canale nel JSON-LD o nei tag link
      if (!autore) {
        const channelNameMatch = html.match(/<link itemprop="name" content="([^"]+)">/i);
        if (channelNameMatch?.[1]) autore = channelNameMatch[1];
      }
      
      // 3. Prova a cercare nel blocco script di YouTube (ownerChannelName)
      if (!autore) {
        const ownerMatch = html.match(/"ownerChannelName":"([^"]+)"/i);
        if (ownerMatch?.[1]) autore = ownerMatch[1];
      }

      // 4. Prova a cercare nel blocco script di YouTube (author)
      if (!autore) {
        const authorMatch = html.match(/"author":"([^"]+)"/i);
        if (authorMatch?.[1]) autore = authorMatch[1];
      }

      // 5. Fallback: se il titolo contiene " - YouTube", prova a estrarre il canale
      if (!autore && titolo.includes(' - YouTube')) {
        const parts = titolo.split(' - ');
        if (parts.length >= 2) autore = parts[parts.length - 2];
      }

      // Gestione Immagine YouTube
      if (!immagine) {
        const videoIdMatch = formattedUrl.match(/(?:v=|\/embed\/|\/watch\?v=|\/v\/|youtu\.be\/|\/shorts\/|watch\?.*v=)([^#\&\?]*).*/);
        if (videoIdMatch && videoIdMatch[1]) {
          immagine = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      } else if (immagine.includes('hqdefault.jpg')) {
        immagine = immagine.replace('hqdefault.jpg', 'maxresdefault.jpg');
      }
    }

    // Pulizia immagine Amazon
    if (formattedUrl.includes('amazon') && immagine) {
      immagine = immagine.replace(/\._[A-Z0-9,]+_\./i, '.');
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
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});