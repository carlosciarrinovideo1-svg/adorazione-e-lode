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
      console.error(`Fetch failed with status ${response.status} for URL: ${formattedUrl}`);
      return new Response(JSON.stringify({ 
        error: `Il sito ha rifiutato la richiesta (errore ${response.status}). Siti come Amazon bloccano il recupero automatico. Prova con IBS, Feltrinelli o altri siti.`,
        titolo: '',
        descrizione: '',
        immagine: '',
        prezzo: 0,
        autore: '',
        isbn: '',
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();

    // Parse JSON-LD blocks
    const jsonLdBlocks: any[] = [];
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let jsonLdMatch;
    while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        if (Array.isArray(parsed)) jsonLdBlocks.push(...parsed);
        else jsonLdBlocks.push(parsed);
      } catch { /* skip invalid JSON-LD */ }
    }

    // Find product/book JSON-LD
    const productLd = jsonLdBlocks.find(b => 
      b['@type'] === 'Product' || b['@type'] === 'Book' || 
      b['@type'] === 'IndividualProduct' || b['@type'] === 'CreativeWork'
    );

    // Extract meta tags
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

    const getTitle = (): string => {
      // 1. OG/Twitter meta
      const meta = getMeta('og:title') || getMeta('twitter:title');
      if (meta) return meta;
      // 2. JSON-LD name
      if (productLd?.name) return productLd.name;
      // 3. <title> tag
      return (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '').trim();
    };

    const getImage = (): string => {
      // 1. OG/Twitter meta
      const meta = getMeta('og:image') || getMeta('twitter:image');
      if (meta) return meta;
      // 2. JSON-LD image
      if (productLd?.image) {
        const img = Array.isArray(productLd.image) ? productLd.image[0] : productLd.image;
        if (typeof img === 'string') return img;
        if (img?.url) return img.url;
      }
      // 3. First large <img> in page (skip icons/logos by filtering small ones)
      const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgMatch?.[1] && !imgMatch[1].includes('logo') && !imgMatch[1].includes('icon')) {
        return imgMatch[1];
      }
      return '';
    };

    const getDescription = (): string => {
      // 1. OG/Twitter/standard meta
      const meta = getMeta('og:description') || getMeta('twitter:description') || getMeta('description');
      if (meta) return meta;
      // 2. JSON-LD description
      if (productLd?.description) return productLd.description;
      return '';
    };

    const getPrice = (): number => {
      // 1. JSON-LD offers
      if (productLd?.offers) {
        const offers = Array.isArray(productLd.offers) ? productLd.offers[0] : productLd.offers;
        if (offers?.price) return parseFloat(String(offers.price).replace(',', '.'));
      }
      // 2. HTML patterns
      const pricePatterns = [
        /(?:€|EUR)\s*([\d]+[.,]\d{2})/i,
        /([\d]+[.,]\d{2})\s*(?:€|EUR)/i,
        /price["\s:]+["\s]*([\d]+[.,]\d{2})/i,
        /amount["\s:]+["\s]*([\d]+[.,]\d{2})/i,
        /data-price=["']([\d]+[.,]\d{2})["']/i,
      ];
      for (const p of pricePatterns) {
        const m = html.match(p);
        if (m?.[1]) return parseFloat(m[1].replace(',', '.'));
      }
      return 0;
    };

    const getAuthor = (): string => {
      // 1. Meta tags
      const meta = getMeta('author') || getMeta('og:book:author') || getMeta('book:author');
      if (meta) return meta;
      // 2. JSON-LD author
      if (productLd?.author) {
        const author = Array.isArray(productLd.author) ? productLd.author[0] : productLd.author;
        if (typeof author === 'string') return author;
        if (author?.name) return author.name;
      }
      return '';
    };

    const getISBN = (): string => {
      // 1. Meta tags
      const meta = getMeta('og:isbn') || getMeta('book:isbn');
      if (meta) return meta;
      // 2. JSON-LD isbn
      if (productLd?.isbn) return productLd.isbn;
      if (productLd?.gtin13) return productLd.gtin13;
      // 3. HTML pattern
      return html.match(/(?:ISBN|ASIN)[:\s]*([0-9X-]{10,17})/i)?.[1] || '';
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
