export interface Product {
  id: string;
  tipo: "libro" | "musica";
  titolo: string;
  autore_artista: string;
  ISBN_ASIN: string;
  prezzo: number;
  lingua: string;
  formato: string;
  descrizione: string;
  immagini: string[];
  url_originale: string;
  categorie: string[];
  tag: string[];
  inventario: number;
  stato: "in stock" | "esaurito";
  data_aggiornamento: string;
  valutazione?: number;
  recensioni?: number;
}

export const products: Product[] = [
  {
    id: "1",
    tipo: "libro",
    titolo: "La Parola che Guida",
    autore_artista: "Marco Rossi",
    ISBN_ASIN: "B09XYZ123",
    prezzo: 14.99,
    lingua: "Italiano",
    formato: "Cartaceo",
    descrizione: "Un viaggio spirituale profondo attraverso la fede cristiana. Questo libro ti accompagnerà in una riflessione quotidiana sulla Parola di Dio, offrendo meditazioni, preghiere e spunti pratici per vivere la tua fede ogni giorno.",
    immagini: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"],
    url_originale: "https://amazon.it/dp/B09XYZ123",
    categorie: ["Spiritualità", "Fede"],
    tag: ["ispirazione", "preghiera", "meditazione"],
    inventario: 10,
    stato: "in stock",
    data_aggiornamento: "2024-01-15",
    valutazione: 4.8,
    recensioni: 127
  },
  {
    id: "2",
    tipo: "libro",
    titolo: "Salmi per il Cuore",
    autore_artista: "Anna Benedetti",
    ISBN_ASIN: "B09ABC456",
    prezzo: 18.50,
    lingua: "Italiano",
    formato: "Cartaceo",
    descrizione: "Una raccolta commentata dei Salmi più amati, con riflessioni profonde e applicazioni pratiche per la vita moderna. Perfetto per lo studio personale o in gruppo.",
    immagini: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
    url_originale: "https://amazon.it/dp/B09ABC456",
    categorie: ["Bibbia", "Studio"],
    tag: ["salmi", "studio biblico", "meditazione"],
    inventario: 25,
    stato: "in stock",
    data_aggiornamento: "2024-01-10",
    valutazione: 4.9,
    recensioni: 89
  },
  {
    id: "3",
    tipo: "musica",
    titolo: "Adorazione Eterna",
    autore_artista: "Worship Italia",
    ISBN_ASIN: "M09DEF789",
    prezzo: 12.99,
    lingua: "Italiano",
    formato: "CD",
    descrizione: "Album di adorazione contemporanea con 12 brani originali che elevano l'anima. Perfetto per momenti di preghiera personale o culto comunitario.",
    immagini: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"],
    url_originale: "https://amazon.it/dp/M09DEF789",
    categorie: ["Worship", "Contemporaneo"],
    tag: ["adorazione", "worship", "italiano"],
    inventario: 50,
    stato: "in stock",
    data_aggiornamento: "2024-01-12",
    valutazione: 4.7,
    recensioni: 234
  },
  {
    id: "4",
    tipo: "libro",
    titolo: "Crescere nella Fede",
    autore_artista: "Don Paolo Martini",
    ISBN_ASIN: "B09GHI012",
    prezzo: 22.00,
    lingua: "Italiano",
    formato: "Cartaceo",
    descrizione: "Una guida completa per il cammino di fede, dall'introduzione ai sacramenti fino alla maturità spirituale. Ideale per catechisti e gruppi parrocchiali.",
    immagini: ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400"],
    url_originale: "https://amazon.it/dp/B09GHI012",
    categorie: ["Catechesi", "Formazione"],
    tag: ["formazione", "catechismo", "sacramenti"],
    inventario: 15,
    stato: "in stock",
    data_aggiornamento: "2024-01-08",
    valutazione: 4.6,
    recensioni: 56
  },
  {
    id: "5",
    tipo: "musica",
    titolo: "Inni della Tradizione",
    autore_artista: "Coro San Pietro",
    ISBN_ASIN: "M09JKL345",
    prezzo: 15.99,
    lingua: "Italiano",
    formato: "CD",
    descrizione: "Una raccolta preziosa dei più bei inni della tradizione cristiana, interpretati dal rinomato Coro San Pietro. 18 brani che toccano il cuore.",
    immagini: ["https://images.unsplash.com/photo-1458560871784-56d23406c091?w=400"],
    url_originale: "https://amazon.it/dp/M09JKL345",
    categorie: ["Tradizionale", "Corale"],
    tag: ["inni", "tradizione", "coro"],
    inventario: 30,
    stato: "in stock",
    data_aggiornamento: "2024-01-05",
    valutazione: 4.9,
    recensioni: 178
  },
  {
    id: "6",
    tipo: "libro",
    titolo: "Preghiere per Ogni Momento",
    autore_artista: "Suor Maria Grazia",
    ISBN_ASIN: "B09MNO678",
    prezzo: 9.99,
    lingua: "Italiano",
    formato: "eBook",
    descrizione: "Un compagno di preghiera digitale per ogni occasione. Dalla mattina alla sera, dalla gioia al dolore, troverai le parole giuste per rivolgerti al Signore.",
    immagini: ["https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400"],
    url_originale: "https://amazon.it/dp/B09MNO678",
    categorie: ["Preghiera", "Devozione"],
    tag: ["preghiera", "quotidiano", "digitale"],
    inventario: 999,
    stato: "in stock",
    data_aggiornamento: "2024-01-14",
    valutazione: 4.5,
    recensioni: 312
  },
  {
    id: "7",
    tipo: "musica",
    titolo: "Giovani in Cammino",
    autore_artista: "Gen Verde",
    ISBN_ASIN: "M09PQR901",
    prezzo: 11.99,
    lingua: "Italiano",
    formato: "MP3",
    descrizione: "Album energico e coinvolgente per i giovani cristiani. Brani che parlano di speranza, amicizia e fede in modo fresco e contemporaneo.",
    immagini: ["https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400"],
    url_originale: "https://amazon.it/dp/M09PQR901",
    categorie: ["Giovani", "Pop Cristiano"],
    tag: ["giovani", "energia", "speranza"],
    inventario: 200,
    stato: "in stock",
    data_aggiornamento: "2024-01-11",
    valutazione: 4.8,
    recensioni: 445
  },
  {
    id: "8",
    tipo: "libro",
    titolo: "La Famiglia secondo Dio",
    autore_artista: "Giovanni e Maria Bianchi",
    ISBN_ASIN: "B09STU234",
    prezzo: 16.50,
    lingua: "Italiano",
    formato: "Cartaceo",
    descrizione: "Una guida pratica per vivere i valori cristiani in famiglia. Dalla comunicazione all'educazione dei figli, un percorso di crescita insieme.",
    immagini: ["https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400"],
    url_originale: "https://amazon.it/dp/B09STU234",
    categorie: ["Famiglia", "Educazione"],
    tag: ["famiglia", "genitori", "valori"],
    inventario: 8,
    stato: "in stock",
    data_aggiornamento: "2024-01-09",
    valutazione: 4.7,
    recensioni: 93
  }
];

export const categories = [
  { name: "Tutti", icon: "Grid3X3", count: products.length },
  { name: "Libri", icon: "BookOpen", count: products.filter(p => p.tipo === "libro").length },
  { name: "Musica", icon: "Music", count: products.filter(p => p.tipo === "musica").length },
  { name: "Spiritualità", icon: "Heart", count: 3 },
  { name: "Worship", icon: "Music2", count: 2 },
  { name: "Famiglia", icon: "Users", count: 1 },
];

export const inspirationalQuotes = [
  {
    text: "Il Signore è il mio pastore: non manco di nulla.",
    source: "Salmo 23:1"
  },
  {
    text: "La fede è fondamento delle cose che si sperano e prova di quelle che non si vedono.",
    source: "Ebrei 11:1"
  },
  {
    text: "Io sono la via, la verità e la vita.",
    source: "Giovanni 14:6"
  }
];
