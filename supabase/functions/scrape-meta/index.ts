const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
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

    console.log('Fetching URL:', formattedUrl);

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch: ${response.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    // Extract meta tags
    const getMeta = (property: string): string => {
      // Try og: first, then standard meta
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

    const getTitle = (): string => {
      return getMeta('og:title') || getMeta('twitter:title') || (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim();
    };

    const getImage = (): string => {
      return getMeta('og:image') || getMeta('twitter:image') || '';
    };

    const getDescription = (): string => {
      return getMeta('og:description') || getMeta('twitter:description') || getMeta('description') || '';
    };

    // Try to extract price from various patterns
    const getPrice = (): number => {
      const pricePatterns = [
        /(?:€|EUR)\s*([\d]+[.,]\d{2})/i,
        /([\d]+[.,]\d{2})\s*(?:€|EUR)/i,
        /price["\s:]+["\s]*([\d]+[.,]\d{2})/i,
        /amount["\s:]+["\s]*([\d]+[.,]\d{2})/i,
      ];
      for (const p of pricePatterns) {
        const m = html.match(p);
        if (m?.[1]) return parseFloat(m[1].replace(',', '.'));
      }
      return 0;
    };

    // Try to extract author
    const getAuthor = (): string => {
      return getMeta('author') || getMeta('og:book:author') || getMeta('book:author') || '';
    };

    // Try to extract ISBN
    const getISBN = (): string => {
      return getMeta('og:isbn') || getMeta('book:isbn') || (html.match(/(?:ISBN|ASIN)[:\s]*([0-9X-]{10,17})/i)?.[1] || '');
    };

    const result = {
      titolo: getTitle(),
      descrizione: getDescription(),
      immagine: getImage(),
      prezzo: getPrice(),
      autore: getAuthor(),
      isbn: getISBN(),
    };

    console.log('Extracted:', JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Scrape error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
