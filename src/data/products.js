export const PRODUCTS = [
  {
    id: "is-001",
    code: "VINTAGE SAREE / PIECE 01",
    name: "THE VARANASI CRIMSON PALLU SLIP",
    priceINR: 28500,
    priceUSD: 340,
    priceEUR: 315,
    priceGBP: 275,
    priceAED: 1250,
    category: "vintage-saree",
    isOneOfOne: true,
    edition: "1 OF 1 VINTAGE SAREE GOWN",
    isBidding: true,
    startingBidINR: 28500,
    currentBidINR: 32500,
    minBidIncrementINR: 500,
    bidsCount: 8,
    auctionEndTime: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    bidsHistory: [
      { id: "b1", bidder: "Collector in Malabar Hill, Mumbai", amount: 32500, time: "14m ago" },
      { id: "b2", bidder: "Patron in Lutyens Delhi", amount: 32000, time: "1h ago" },
      { id: "b3", bidder: "Collector in Indiranagar, Bangalore", amount: 31000, time: "3h ago" },
      { id: "b4", bidder: "Patron in Boat Club, Chennai", amount: 30000, time: "6h ago" },
      { id: "b5", bidder: "Opening Atelier Reserve", amount: 28500, time: "1d ago" }
    ],
    status: "available",
    material: "Archival Pure Silk Saree with Gold Zari Paisley Pallu",
    origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
    color: "Crimson & Antique Gold",
    colorHex: "#A92424",
    sizes: ["XS", "S", "M"],
    imagePrimary: "/images/piece-crimson-saree.jpg",
    imageSecondary: "/images/dress.jpg",
    description: "Crafted from a singular vintage Banarasi silk saree discovered in Varanasi. The gown is sculpted around the ornate heirloom gold zari border and paisley pallu, flowing into an exposed backless silhouette. Some carry faded colours and marks of another time — that is exactly what makes this piece irreproducible.",
    details: [
      "100% authentic vintage pure silk saree with woven antique gold zari",
      "Designed directly around the natural drape and border placement of the found textile",
      "One design. One piece. Will never exist again once claimed",
      "Includes complimentary matching vintage silk remnant neck tie",
      "Hand-signed Certificate of Provenance & Archive serial #IS-001"
    ]
  },
  {
    id: "is-002",
    code: "VINTAGE SAREE / PIECE 02",
    name: "THE EMERALD BROCADE BACKLESS GOWN",
    priceINR: 34000,
    priceUSD: 410,
    priceEUR: 380,
    priceGBP: 330,
    priceAED: 1500,
    category: "vintage-saree",
    isOneOfOne: true,
    edition: "1 OF 1 VINTAGE BROCADE GOWN",
    status: "available",
    material: "Vintage South Indian Silk Saree with All-Over Floral Zari",
    origin: "Discovered in Tamil Nadu · Handcrafted in Goa Atelier",
    color: "Imperial Emerald & Gold",
    colorHex: "#1E5638",
    sizes: ["S", "M"],
    imagePrimary: "/images/piece-emerald-gown.jpg",
    imageSecondary: "/images/hero.jpg",
    description: "Reborn from an extraordinary vintage emerald silk saree adorned with intricate hand-loomed gold brocade floral bootis. Features a dramatic deep-V cowl back and a cascading train cut along the saree's original ornamental selvedge. Once it is gone, it will never exist again.",
    details: [
      "Heavy vintage silk drape with natural sheen and aged heirloom patina",
      "Cut following zero-waste geometry to preserve the full integrity of the saree pallu",
      "Subtle marks of another era celebrating authentic slow craftsmanship",
      "Matching emerald silk hair ribbon cut from textile remnants included",
      "Hand-numbered piece #02 of inaugural Volume 001"
    ]
  },
  {
    id: "is-003",
    code: "VINTAGE SAREE / PIECE 03",
    name: "THE SAFFRON SUNSET HALTER GOWN",
    priceINR: 32000,
    priceUSD: 385,
    priceEUR: 355,
    priceGBP: 305,
    priceAED: 1410,
    category: "vintage-saree",
    isOneOfOne: true,
    edition: "1 OF 1 HEIRLOOM SILK GOWN",
    isBidding: true,
    startingBidINR: 32000,
    currentBidINR: 35500,
    minBidIncrementINR: 500,
    bidsCount: 6,
    auctionEndTime: new Date(Date.now() + 19 * 3600 * 1000).toISOString(),
    bidsHistory: [
      { id: "b1", bidder: "Patron in Jubilee Hills, Hyderabad", amount: 35500, time: "22m ago" },
      { id: "b2", bidder: "Collector in Koregaon Park, Pune", amount: 35000, time: "2h ago" },
      { id: "b3", bidder: "Patron in South Mumbai", amount: 34000, time: "4h ago" },
      { id: "b4", bidder: "Opening Atelier Reserve", amount: 32000, time: "1d ago" }
    ],
    status: "available",
    material: "Vintage Pure Silk Saree with Silver-Gold Zari Weave",
    origin: "Discovered in Rajasthan · Handcrafted in Goa Atelier",
    color: "Marigold Saffron & Silver",
    colorHex: "#D9822B",
    sizes: ["XS", "S", "M"],
    imagePrimary: "/images/piece-saffron-gown.jpg",
    imageSecondary: "/images/piece-crimson-saree.jpg",
    description: "Handcrafted from an antique marigold and saffron silk saree bearing rare dual-toned silver and gold zari work. The fluid halter neckline frames the shoulders before sweeping into a majestic floor-length drape that honors the saree's grand historical past.",
    details: [
      "Pure vintage handloom silk with sandwashed matte texture",
      "Intricate heritage border preserved along the hem and halter neckline",
      "Zero waste cutting — remnants repurposed into matching pocket square and sash",
      "One design. One piece. Never again.",
      "Delicate cold hand soak or gentle eco dry clean"
    ]
  },
  {
    id: "is-004",
    code: "VINTAGE DUPATTA / PIECE 04",
    name: "THE ANJUNA INDIGO DUPATTA RESORT SET",
    priceINR: 22500,
    priceUSD: 270,
    priceEUR: 250,
    priceGBP: 215,
    priceAED: 990,
    category: "vintage-dupatta",
    isOneOfOne: true,
    edition: "1 OF 1 DUPATTA SILHOUETTE",
    status: "available",
    material: "Vintage Handwoven Cotton-Silk Dupatta with Zari Borders",
    origin: "Discovered in Bagru · Handcrafted in Goa Atelier",
    color: "Indigo Mineral & Ivory",
    colorHex: "#2C3E55",
    sizes: ["S", "M", "L"],
    imagePrimary: "/images/piece-dupatta-set.jpg",
    imageSecondary: "/images/linen.jpg",
    description: "Consciously tailored from a vintage handwoven Indian dupatta featuring authentic natural indigo block-printing and gold thread border trims. An effortlessly relaxed wrap tunic paired with wide-leg resort trousers for coastal living. Singular, breathable, and deeply intentional.",
    details: [
      "Vintage artisanal block-printed textile with subtle weathered variations",
      "Natural hand-carved mother-of-pearl buttons",
      "Deep functional pockets engineered into the side seams",
      "Remnants transformed into matching travel pouch and hair tie",
      "Complimentary express air shipping across India"
    ]
  },
  {
    id: "is-005",
    code: "ZERO-WASTE REMNANTS / PIECE 05",
    name: "THE ATELIER PLEATED REMNANT COLLAR & SCARF",
    priceINR: 12500,
    priceUSD: 150,
    priceEUR: 140,
    priceGBP: 120,
    priceAED: 550,
    category: "remnants",
    isOneOfOne: true,
    edition: "1 OF 1 ZERO-WASTE ACCENT",
    status: "available",
    material: "Vintage Silk Saree Border Remnants with Gold Thread Tassels",
    origin: "Hand-stitched in Goa Atelier · 100% Circular Remnants",
    color: "Multicolor Brocade & Antique Zari",
    colorHex: "#8D4B32",
    sizes: ["One Size"],
    imagePrimary: "/images/piece-remnant-scarf.jpg",
    imageSecondary: "/images/piece-emerald-gown.jpg",
    description: "Living proof that every beautiful textile deserves a second life. Even the smallest border fragments from our vintage saree gowns are hand-pleated, stitched into an exquisite royal collar neck piece, and finished with antique thread tassels. Can be worn as an editorial statement necklace or draped over an evening slip.",
    details: [
      "100% upcycled vintage saree border remnants — absolute zero textile waste",
      "Intricate hand-pleated construction taking 14 hours of fine hand-needlework",
      "Adjustable ribbon tie closure crafted from raw vintage silk",
      "One design. One piece. Never again.",
      "Delivered in hand-stitched khadi dust bag"
    ]
  },
  {
    id: "is-006",
    code: "VINTAGE SAREE / PIECE 06",
    name: "THE SOLSTICE BACKLESS TERRACOTTA SLIP",
    priceINR: 24500,
    priceUSD: 295,
    priceEUR: 275,
    priceGBP: 235,
    priceAED: 1080,
    category: "vintage-saree",
    isOneOfOne: true,
    edition: "1 OF 1 VINTAGE SAREE GOWN",
    status: "available",
    material: "Vintage Pure Silk Saree with Terracotta Hand-dye",
    origin: "Discovered in Varanasi · Handcrafted in Goa Atelier",
    color: "Terracotta Sunset",
    colorHex: "#B85838",
    sizes: ["XS", "S", "M"],
    imagePrimary: "/images/dress.jpg",
    imageSecondary: "/images/hero.jpg",
    description: "Designed entirely around an archival vintage silk saree with faded hand-loomed terracotta tones and intricate gold zari. Features a bias-cut body that cascades effortlessly into an exposed low-back tie silhouette. Once it's gone, this exact piece will never exist again.",
    details: [
      "Crafted from a single vintage pure silk saree — completely unique 1 of 1",
      "Designed around the natural border placements and drape of the discovered textile",
      "Carries subtle marks and gentle faded tones of another era",
      "Complimentary matching vintage silk remnant neck tie included",
      "Dry clean only or gentle cold hand soak"
    ]
  },
  {
    id: "is-007",
    code: "VINTAGE SAREE / PIECE 07",
    name: "THE GOLDEN HOUR DRAPE GOWN",
    priceINR: 29500,
    priceUSD: 355,
    priceEUR: 330,
    priceGBP: 285,
    priceAED: 1300,
    category: "vintage-saree",
    isOneOfOne: true,
    edition: "1 OF 1 VINTAGE TEXTILE GOWN",
    isBidding: true,
    startingBidINR: 29500,
    currentBidINR: 31500,
    minBidIncrementINR: 500,
    bidsCount: 4,
    bidsHistory: [
      { id: "b1", bidder: "Collector in Alibaug", amount: 31500, time: "45m ago" },
      { id: "b2", bidder: "Patron in DLF Phase 5, Gurgaon", amount: 31000, time: "3h ago" },
      { id: "b3", bidder: "Collector in Bandra West, Mumbai", amount: 30000, time: "7h ago" },
      { id: "b4", bidder: "Opening Atelier Reserve", amount: 29500, time: "1d ago" }
    ],
    status: "available",
    material: "Vintage Habotai Silk Saree with Champagne Lustre",
    origin: "Discovered in Gujarat · Handcrafted in Goa Atelier",
    color: "Champagne Saffron",
    colorHex: "#D8C7A5",
    sizes: ["S", "M"],
    imagePrimary: "/images/hero.jpg",
    imageSecondary: "/images/piece-saffron-gown.jpg",
    description: "Repurposed from an exceptional vintage Indian silk textile discovered with delicate golden weave work. Liquid cowl neckline and open back that catches coastal golden light. One design. One piece. Never again.",
    details: [
      "100% vintage pure silk with natural aged luster",
      "Sweeping floor-length column cut shaped around the vintage fabric length",
      "Zero waste cutting process — remnants repurposed into accessories",
      "Signed atelier provenance card with textile origin"
    ]
  },
  {
    id: "is-008",
    code: "SLOW-BATCH / PIECE 08",
    name: "THE MANDREM RELAXED LINEN & VINTAGE BORDER SET",
    priceINR: 18500,
    priceUSD: 220,
    priceEUR: 205,
    priceGBP: 175,
    priceAED: 810,
    category: "vintage-dupatta",
    isOneOfOne: true,
    edition: "1 OF 1 SLOW BATCH PIECE",
    status: "available",
    material: "Hand-spun Organic Flax & Vintage Saree Pallu Inset Details",
    origin: "Handcrafted in India · Zero Waste Atelier",
    color: "Raw Ecru Sand",
    colorHex: "#EFEBE2",
    sizes: ["XS", "S", "M", "L"],
    imagePrimary: "/images/linen.jpg",
    imageSecondary: "/images/piece-dupatta-set.jpg",
    description: "Tailored from slow-batch hand-spun linen and accented with authentic vintage saree border trims along the collar, placket and cuffs. Oversized resort shirt paired with relaxed drawstring trousers. Breathes effortlessly under intense summer heat.",
    details: [
      "Hand-spun breathable natural fibers pre-washed for softness",
      "Vintage saree border accents inside collar and cuff turn-backs",
      "Natural shell buttons sourced along the Indian coast",
      "Deep functional pockets and fluid drape"
    ]
  }
];

export const ARCHIVE_PIECES = [
  {
    id: "arch-01",
    code: "INAUGURAL PIECE 01",
    name: "THE VAGATOR CLIFF VINTAGE SILK SLIP",
    material: "Vintage Hand-dyed Silk Saree with Gold Zari",
    ownerCity: "South Mumbai",
    year: "Inaugural Vol. 001",
    soldPrice: "₹28,500",
    image: "/images/piece-crimson-saree.jpg",
    story: "Crafted from a discovered vintage silk saree with faded saffron hand-dyeing. One design. One piece. Never again."
  },
  {
    id: "arch-02",
    code: "INAUGURAL PIECE 02",
    name: "THE ALIBAUG HAVELI GOWN",
    material: "Vintage Chanderi Saree with Brocade",
    ownerCity: "Lutyens Delhi",
    year: "Inaugural Vol. 001",
    soldPrice: "₹34,000",
    image: "/images/piece-emerald-gown.jpg",
    story: "Carved around an heirloom emerald saree discovered in Tamil Nadu. Once claimed, permanently archived."
  },
  {
    id: "arch-03",
    code: "INAUGURAL PIECE 03",
    name: "THE MORJIM BEACH RESORT SET",
    material: "Vintage Handwoven Dupatta & Saree Trims",
    ownerCity: "Indiranagar, Bengaluru",
    year: "Inaugural Vol. 001",
    soldPrice: "₹22,500",
    image: "/images/piece-dupatta-set.jpg",
    story: "Slow batches. Zero waste. Accents cut from saree border remnants."
  },
  {
    id: "arch-04",
    code: "INAUGURAL PIECE 04",
    name: "THE UDAIVILAS SUNSET HALTER",
    material: "Vintage Saffron Silk Saree",
    ownerCity: "Dubai, UAE",
    year: "Inaugural Vol. 001",
    soldPrice: "₹32,000",
    image: "/images/piece-saffron-gown.jpg",
    story: "Showing the glorious marks and faded colors of another era. A second life for beautiful things."
  }
];

export const EDITORIAL_STORIES = [
  {
    volume: "VOL. 001 DISPATCH",
    location: "GOA & THE KONKAN COAST",
    title: "A SECOND LIFE FOR BEAUTIFUL THINGS",
    excerpt: "We create one piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Each piece is designed around the fabric we find — rather than forcing the fabric into a predetermined idea.",
    photographer: "Tarun Sharma (Mumbai)",
    filmType: "Kodak Portra 400",
    image: "/images/piece-crimson-saree.jpg"
  },
  {
    volume: "ATELIER DISPATCH",
    location: "SLOW BATCHES & ZERO WASTE",
    title: "SOME SHOW THE MARKS OF ANOTHER TIME",
    excerpt: "Some carry intricate handwork. Some carry faded colours. Some show the marks of another time. And that’s exactly what makes them beautiful. Remnants become scarves and neck pieces.",
    photographer: "Avani Patel (Delhi)",
    filmType: "Cinestill 800T",
    image: "/images/piece-remnant-scarf.jpg"
  }
];

export const FAQS = [
  {
    q: "WHAT DOES 'ONE DESIGN. ONE PIECE. NEVER AGAIN.' MEAN?",
    a: "We create one single piece of each design, crafted from vintage Indian sarees, dupattas and handworked textiles. Once a piece is claimed, that exact creation will never exist again. We design around the vintage textile we find rather than forcing it into a predetermined mold."
  },
  {
    q: "HOW DOES YOUR ZERO-WASTE ETHOS WORK?",
    a: "We believe every beautiful textile deserves a second life. Even the smallest remnants left over from tailoring our gowns are thoughtfully transformed into scarves, neck pieces, and accessories, keeping waste to a minimum."
  },
  {
    q: "ARE MARKS OR COLOR VARIATIONS NORMAL IN VINTAGE TEXTILES?",
    a: "Yes, and that is what makes each piece so deeply special. Some carry intricate handwork, some carry gentle faded colours, and some show the authentic marks of another era. These tell the textile's story and ensure no one else in the world owns a dress like yours."
  },
  {
    q: "HOW FAST IS SHIPPING ACROSS INDIA?",
    a: "We dispatch in slow, intentional batches with complimentary express air delivery across India via BlueDart on all orders over ₹5,000. Typical transit time to Mumbai, Delhi NCR, Bengaluru, Hyderabad, and Goa is 2–4 business days."
  },
  {
    q: "WHICH PAYMENT METHODS ARE ACCEPTED?",
    a: "We accept all Indian payment modes: UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking across 50+ banks, Credit/Debit Cards (RuPay, Visa, Mastercard, Amex), and EMI."
  },
  {
    q: "HOW SHOULD I CARE FOR MY VINTAGE SILK PIECE?",
    a: "Because these are precious vintage silks with authentic handwork, we recommend gentle dry cleaning or a delicate cold hand soak using mild eco-friendly detergent. Never wring, and dry in natural shade."
  }
];
