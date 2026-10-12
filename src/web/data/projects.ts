export type Project = {
  name: string;
  slug: string;
  tag: string;
  city: "Batumi" | "Tbilisi" | "Chakvi" | "Gonio" | "Makhinjauri" | "Shekvetili";
  address: string;
  seaDistance: string;
  seaMeters: string;
  location: string;
  desc: string;
  yield: string;
  developer: string;
  /** Architect / architecture studio; placeholder until confirmed. */
  architect?: string;
  priceFrom: string;
  priceUSD: number; // for sorting
  completion: string;
  area: string;
  ceilingHeight: string;
  floors: string;
  buildings: string;
  finishing: string;
  /** Optional; defaults to localized "Yes" in the Property Details grid. */
  climateAdaptation?: string;
  installment: string;
  features: string[];
  materials: string;
  photos: string[];
  cardImage: string;
  /**
   * Optional 5-image showreel for the project-page mosaic (house / outdoor /
   * reception / apartment mix). Lightbox always uses the full `photos` list.
   */
  galleryPreview?: string[];
  lat: number;
  lng: number;
  /** Google Maps search query for the embed pin; falls back to lat,lng. */
  mapsQuery?: string;
  floorPlans?: string[];
  floorPlanLabels?: string[];
  floorPlanAreas?: string[];
  pricePerSqm?: string;
  /** Defaults to apartment when omitted. */
  propertyType?: "apartment" | "aparthotel" | "apartment-aparthotel" | "residence" | "villa" | "townhouse";
  liveCameraUrl?: string;
  tourUrl?: string;
  panoramaUrl?: string;
  developerLogo?: string;
  downPaymentPct?: number;
  /** Remaining 0% months as of installmentAnchorYm; ticks down 1 each calendar month. */
  installmentMonths?: number;
  /** YYYY-MM when installmentMonths was the remaining term. */
  installmentAnchorYm?: string;
  /**
   * Optional payment schedules shown as percentage bars.
   * When omitted, derived from downPaymentPct / installment when possible.
   */
  paymentPlans?: PaymentPlan[];
  developerBody?: string;
  districtTitle?: string;
  districtBody?: string;
  districtBody2?: string;
  apartmentsKey?: "piazza" | "parkline";
  /** Optional construction timeline; when omitted, derived from completion year. */
  constructionProgress?: ConstructionProgress;
  /** Optional award badges shown under the sidebar offer card. */
  awards?: { src: string; alt: string }[];
  /**
   * Optional ownership / loyalty benefits block (e.g. Silk Rewards).
   * When set, shown as “Ownership benefits” with a popup for the full list.
   */
  ownershipBenefits?: {
    title: string;
    body: string;
    linkLabel: string;
    popupItems: string[];
  };
  /** Show a “Trophy property” badge next to the project name. */
  trophyProperty?: boolean;
  /**
   * When false, project is kept in data (direct URL / re-enable later)
   * but hidden from catalog and home selected-projects rails.
   * Defaults to true when omitted.
   */
  listedInCatalog?: boolean;
  /** Pre-sale badge shown on catalog cards and the project page. */
  presale?: string;
  /** Pre-sale terms shown in the project-page offer card and banner. */
  presaleNote?: string;
  /** Pre-sale landing page linked from the project page. */
  presaleUrl?: string;
  /** Hide the street address and the location map. */
  hideLocation?: boolean;
  /** Payment-plan names, in the same order as `paymentPlans`. */
  paymentPlanNames?: string[];
  /** Apartment types with price ranges per payment plan. */
  unitTypes?: UnitType[];
  /** Units on sale now (e.g. in completed towers), with the date of the snapshot. */
  availableUnits?: AvailableUnit[];
  availableUnitsAsOf?: string;
  /** Optional long-form sections (developer, history, construction) on the project page. */
  story?: { title: string; body: string }[];
  /** Nearby places; when set, the location section shows an interactive map instead of the Google embed. */
  pois?: Poi[];
};

export type ConstructionStageId = "foundation" | "construction" | "facade" | "handover";

export type ConstructionStage = {
  id: ConstructionStageId;
  year: number;
};

export type ConstructionProgress = {
  /** Last reached stage index (0-based); stages 0..activeIndex render as complete. */
  activeIndex: number;
  stages: ConstructionStage[];
};

export type PaymentStage = "down" | "construction" | "handover";

export type PaymentSegment = {
  pct: number;
  stage: PaymentStage;
  /** Overrides the default stage label (e.g. "Over 30 months"). */
  label?: string;
};

export type PoiCategory = "metro" | "landmark" | "shopping" | "education" | "transport";

/** A nearby place shown on the project's neighbourhood map. */
export type Poi = {
  id: string;
  category: PoiCategory;
  name: { en: string; ru: string; ka: string };
  lat: number;
  lng: number;
};

export type AvailableUnit = {
  building: string;
  type: string;
  area: string;
  pricePerSqm: string;
  price: string;
  count: number;
};

export type UnitType = {
  type: string;
  area: string;
  /** Price-per-m² range for each payment plan, in the same order as `paymentPlans`. */
  prices: string[];
  priceFrom: string;
};

export type PaymentPlan = PaymentSegment[];

/** Resolve displayable payment plans; sitewide standard is 30% / 70%. */
export function resolvePaymentPlans(p: Project): PaymentPlan[] {
  if (p.paymentPlans?.length) return p.paymentPlans;
  return [[{ stage: "down", pct: 30 }, { stage: "construction", pct: 70 }]];
}

/** Resolve construction timeline for the Progress & Updates bar. */
export function resolveConstructionProgress(p: Project): ConstructionProgress {
  if (p.constructionProgress?.stages?.length) {
    const stages = p.constructionProgress.stages;
    const activeIndex = Math.max(0, Math.min(stages.length - 1, p.constructionProgress.activeIndex));
    return { stages, activeIndex };
  }

  const match = p.completion.match(/20\d{2}/);
  const handover = match ? Number(match[0]) : new Date().getFullYear() + 2;
  const stages: ConstructionStage[] = [
    { id: "foundation", year: handover - 3 },
    { id: "construction", year: handover - 2 },
    { id: "facade", year: handover - 1 },
    { id: "handover", year: handover },
  ];
  const now = new Date().getFullYear();
  let activeIndex = stages.findIndex((s) => s.year > now) - 1;
  if (activeIndex < 0) activeIndex = stages.every((s) => s.year <= now) ? stages.length - 1 : 0;
  return { stages, activeIndex };
}

export const projects: Project[] = [
  {
    name: "HISNI by Biograpi",
    slug: "hisni",
    tag: "Tbilisi · Towers I–II on sale · Tower III pre-sale",
    presale: "Pre-Sale · 5–7 Nov",
    presaleNote: "Pre-sale runs 5, 6, 7 November only, with a limited number of apartments. Reserve your place with a fully refundable USD 1,000 fee — booking goes through me personally on a Zoom call.",
    presaleUrl: "/hisni-presale",
    city: "Tbilisi",
    address: "69 Queen Ketevan Ave, Isani, Tbilisi",
    seaDistance: "2 min walk to Isani metro",
    seaMeters: "Inland",
    location: "Isani · 69 Queen Ketevan Ave · next to Isani metro",
    districtTitle: "Isani — Tbilisi's oldest district",
    districtBody: "HISNI stands at 69 Queen Ketevan Avenue — one of the longest avenues in the city, following the historic road from Tbilisi to Kakheti. Isani metro and Isani Mall are a few minutes' walk away, the nearest bus stop is 75 m from the building (buses 305, 309, 325, 333, 393 and several minibus routes), and the Isani bus station and the Mtkvari embankment are close by.",
    districtBody2: "Schools No. 87, 88 and 96, Tbilisi State University and the Shotadze Medical Academy are within 2 km, and clinics within 1.5 km. The Old Town — Metekhi Church, the Abanotubani sulphur baths, Narikala Fortress and Holy Trinity Cathedral — is 10–15 minutes by car, and the airport is 14 km away (20–25 minutes).",
    desc: "HISNI by Biograpi is a multifunctional residential complex in Tbilisi that brings homes, offices, retail and leisure into one place: 36-floor towers with a pool, spa, padel court and an 8,000 m² green terrace. Apartments in Towers I and II are on sale now, from $93,450. Tower III opens with a three-day pre-sale on 5, 6 and 7 November — studios, one- and two-bedroom apartments from $1,800/m², completion in May 2031.",
    yield: "",
    developer: "Biograpi",
    priceFrom: "From $67,900",
    priceUSD: 67900,
    completion: "2028–2031",
    area: "34–107 m²",
    ceilingHeight: "2.95 m (Towers I–II)",
    floors: "36 floors",
    buildings: "3 towers",
    finishing: "Green frame",
    climateAdaptation: "On request",
    pricePerSqm: "from $1,800/m²",
    installment: "0% down: 20% over 30 months, 80% in month 31 · or 10% / 40% / 50%",
    paymentPlanNames: ["Tower III · Plan 1 — 20% over 30 months", "Tower III · Plan 2 — 10% / 40% / 50%"],
    paymentPlans: [
      [
        { stage: "construction", pct: 20, label: "Over 30 months, no down payment" },
        { stage: "handover", pct: 80, label: "Month 31 (May 2029)" },
      ],
      [
        { stage: "down", pct: 10, label: "Down payment" },
        { stage: "construction", pct: 40, label: "Until completion" },
        { stage: "handover", pct: 50, label: "On completion (May 2031)" },
      ],
    ],
    unitTypes: [
      { type: "Studio", area: "34.38–34.82 m²", prices: ["$1,975–2,195/m²", "$2,155–2,395/m²"], priceFrom: "from $67,900" },
      { type: "1 bedroom", area: "62.95–67.80 m²", prices: ["$1,875–2,095/m²", "$2,045–2,285/m²"], priceFrom: "from $118,100" },
      { type: "2 bedrooms", area: "94–95 m²", prices: ["$1,800–2,020/m²", "$1,963–2,203/m²"], priceFrom: "from $169,200" },
    ],
    story: [
      {
        title: "About the developer — Biograpi Living",
        body: "Biograpi Living is a Tbilisi developer founded in 2022, whose projects are supported by Invia Group, a Georgian business group with more than 25 years of history across fuel (Wissol), real estate, retail and restaurants. HISNI is Biograpi's fourth project; its portfolio also includes Sakeni, Matiani, Chantan, Bare, Daira, Mozaika, Libretto and Gardani. The company is led by CEO Vasil Pkhakadze and has its own quality-control, environmental and occupational-safety teams.",
      },
      {
        title: "Why it is called HISNI",
        body: "Hisni is the Arabic word for “fortress”. In the 8th–9th centuries Isani, one of Tbilisi's oldest districts, was walled with stone and a moat and became known by this name. The complex brings that history back — with views of the Old Town, the Mtkvari River and Holy Trinity Cathedral.",
      },
      {
        title: "Towers and timeline",
        body: "HISNI is planned as four 36-floor towers. Towers I and II are under construction with completion in Q4 2028, and their remaining apartments are on sale now. Tower III opens with a three-day pre-sale on 5–7 November, with completion in May 2031; Tower IV is at the design stage. The developer publishes construction progress photos every month.",
      },
      {
        title: "How it is built",
        body: "Floors 1–5 hold retail and offices, floors 6–36 are residential. The frame is monolithic reinforced concrete with insulated thermal-block walls; the façade combines fibre concrete with Italian terracotta panels that resist temperature swings, UV and fire. The structure meets Georgia's seismic standard and stands on bedrock. Engineering safety is overseen by Meinhardt, acoustics and sound insulation by Acustico, and façade engineering by Germany's NBK.",
      },
      {
        title: "What you get with the apartment",
        body: "Apartments are delivered in green frame: rough works done, wiring in place, walls and ceilings prepared for the final finish. Each has its own autonomous heating, provision for split-system air conditioning, energy-saving double glazing in enlarged openings, a reinforced entrance door and an open balcony or terrace. Water, gas, electricity, sewerage, intercom and fire alarm are connected.",
      },
      {
        title: "After you move in",
        body: "The building is run as a serviced residence: 24-hour security, CCTV and concierge, cleaning and landscaping, pool maintenance, fire-safety systems, a backup power generator, water-reservoir monitoring and a dedicated communication manager for residents.",
      },
      {
        title: "Buying with confidence",
        body: "The plot is registered in Georgia's public registry under cadastral code 01.17.13.038.059 — I check the extract with you before any payment. Apartments can be bought outright, on the developer's instalment plans, or with a TBC Bank mortgage.",
      },
    ],
    availableUnitsAsOf: "12 October 2026",
    availableUnits: [
      { building: "Tower I", type: "1 bedroom", area: "63.6–71.3 m²", pricePerSqm: "$2,300", price: "$146,326–163,898", count: 5 },
      { building: "Tower I", type: "2 bedrooms", area: "102.7–106.6 m²", pricePerSqm: "$2,050", price: "$210,433–218,448", count: 26 },
      { building: "Tower II", type: "Studio", area: "37.4 m²", pricePerSqm: "$2,500", price: "$93,450", count: 2 },
      { building: "Tower II", type: "1 bedroom", area: "64.3–69.7 m²", pricePerSqm: "$2,300", price: "$147,821–160,356", count: 25 },
      { building: "Tower II", type: "2 bedrooms", area: "97.5–99.0 m²", pricePerSqm: "$2,150", price: "$209,668–212,872", count: 16 },
    ],
    features: [
      "Views of the Old Town, the Mtkvari River and Holy Trinity Cathedral",
      "8,000 m² car-free green roof garden with children's spaces",
      "25 m pool, fitness centre, spa and aesthetic centre",
      "Padel, basketball and football courts, running track",
      "Supermarket, pharmacy, bank, cafés and restaurants in the complex",
      "Lobby with 24/7 concierge, security and CCTV",
      "Underground parking, imported high-speed lifts",
      "Autonomous heating in every apartment, split-system air conditioning",
      "Energy-saving double glazing, reinforced entrance doors",
      "Backup power generator",
    ],
    materials: "Monolithic reinforced-concrete frame with insulated thermal-block walls; fibre-concrete and Italian terracotta façade (engineering by NBK, Germany); engineering safety overseen by Meinhardt, acoustics by Acustico. Seismic-standard structure on bedrock. Delivered in green frame.",
    photos: [
      "/projects/hisni/towers.jpg",
      "/projects/hisni/arches.jpg",
      "/projects/hisni/park.jpg",
      "/projects/hisni/dusk.jpg",
      "/projects/hisni/garden.jpg",
      "/projects/hisni/pool.jpg",
      "/projects/hisni/interior.jpg",
      "/projects/hisni/plan-studio.jpg",
      "/projects/hisni/plan-1br.jpg",
      "/projects/hisni/plan-2br.jpg",
    ],
    galleryPreview: [
      "/projects/hisni/towers.jpg",
      "/projects/hisni/park.jpg",
      "/projects/hisni/pool.jpg",
      "/projects/hisni/interior.jpg",
      "/projects/hisni/arches.jpg",
    ],
    cardImage: "/projects/hisni/card.jpg",
    // Exact site location from the developer (Google Maps pin).
    lat: 41.685904,
    lng: 44.838343,
    mapsQuery: "41.685904,44.838343",
    pois: [
      { id: "isani-metro", category: "metro", name: { en: "Isani metro", ru: "Метро «Исани»", ka: "მეტრო ისანი" }, lat: 41.68663, lng: 44.83996 },
      { id: "aragveli-metro", category: "metro", name: { en: "300 Aragveli metro", ru: "Метро «300 Арагвели»", ka: "მეტრო 300 არაგველი" }, lat: 41.68799, lng: 44.82623 },
      { id: "avlabari-metro", category: "metro", name: { en: "Avlabari metro", ru: "Метро «Авлабари»", ka: "მეტრო ავლაბარი" }, lat: 41.69222, lng: 44.81482 },
      { id: "isani-mall", category: "shopping", name: { en: "Isani Mall", ru: "ТЦ Isani Mall", ka: "ისანი მოლი" }, lat: 41.68301, lng: 44.84112 },
      { id: "sea-plaza", category: "shopping", name: { en: "Tbilisi Sea Plaza", ru: "Tbilisi Sea Plaza", ka: "თბილისის ზღვის პლაზა" }, lat: 41.70749, lng: 44.86035 },
      { id: "seu", category: "education", name: { en: "SEU University campus", ru: "Кампус университета SEU", ka: "SEU-ს კამპუსი" }, lat: 41.68917, lng: 44.8286 },
      { id: "sameba", category: "landmark", name: { en: "Holy Trinity Cathedral", ru: "Собор Святой Троицы", ka: "სამების საკათედრო ტაძარი" }, lat: 41.69755, lng: 44.81652 },
      { id: "metekhi", category: "landmark", name: { en: "Metekhi Church", ru: "Церковь Метехи", ka: "მეტეხის ტაძარი" }, lat: 41.69015, lng: 44.81125 },
      { id: "abanotubani", category: "landmark", name: { en: "Abanotubani sulphur baths", ru: "Серные бани Абанотубани", ka: "აბანოთუბანი" }, lat: 41.68765, lng: 44.81148 },
      { id: "narikala", category: "landmark", name: { en: "Narikala Fortress", ru: "Крепость Нарикала", ka: "ნარიყალა" }, lat: 41.68773, lng: 44.80911 },
      { id: "rike", category: "landmark", name: { en: "Rike Park", ru: "Парк Рике", ka: "რიყის პარკი" }, lat: 41.6932, lng: 44.80999 },
      { id: "peace-bridge", category: "landmark", name: { en: "Bridge of Peace", ru: "Мост Мира", ka: "მშვიდობის ხიდი" }, lat: 41.69298, lng: 44.80806 },
      { id: "freedom-square", category: "landmark", name: { en: "Freedom Square", ru: "Площадь Свободы", ka: "თავისუფლების მოედანი" }, lat: 41.69365, lng: 44.80115 },
      { id: "rail", category: "transport", name: { en: "Tbilisi Central Station", ru: "Центральный вокзал", ka: "თბილისის ცენტრალური სადგური" }, lat: 41.72164, lng: 44.79952 },
      { id: "airport", category: "transport", name: { en: "Tbilisi International Airport", ru: "Международный аэропорт Тбилиси", ka: "თბილისის საერთაშორისო აეროპორტი" }, lat: 41.66855, lng: 44.95593 },
    ],
  },
  {
    name: "Piazza Residence",
    slug: "piazza-residence",
    tag: "Old Batumi · Historic Core",
    city: "Batumi",
    address: "59–61 Vakhtang Gorgasali St, Old Batumi",
    seaDistance: "10 minutes to the sea",
    seaMeters: "850 m",
    location: "Old Batumi, Vakhtang Gorgasali 59–61 · 10 min walk to the sea",
    desc: "A landmark residence in the historic heart of Old Batumi. Architecture that reads the neighbourhood's heritage, a private piazza with Venetian fountains, and a restored 119-year cultural monument. Step outside and you are already in the city's cultural district — the seafront is a ten-minute walk.",
    yield: "10–12%",
    developer: "Tower Group x MOVE Development",
    architect: "Alpha Architecture",
    priceFrom: "From $89,250",
    priceUSD: 89250,
    completion: "Q4 2028",
    area: "35.1–141.3 m²",
    ceilingHeight: "3 m",
    floors: "24",
    buildings: "1",
    finishing: "White frame",
    climateAdaptation: "Yes",
    installment: "30% down / 0% over 27 months",
    downPaymentPct: 30,
    installmentMonths: 27,
    installmentAnchorYm: "2026-08",
    developerLogo: "/projects/piazza/brand/developer-logo.png",
    constructionProgress: {
      activeIndex: 1,
      stages: [
        { id: "foundation", year: 2025 },
        { id: "construction", year: 2026 },
        { id: "facade", year: 2027 },
        { id: "handover", year: 2028 },
      ],
    },
    developerBody:
      "Tower Group x MOVE Development is the partnership behind Piazza Residence — a premium complex that restores a protected historic building and adds a contemporary tower with hotel-grade infrastructure in the old town.",
    districtTitle: "Old Batumi",
    districtBody:
      "Old Batumi is the city's cultural and entertainment core: the historic Piazza, central park, restaurants, boutiques and the seaside boulevard are all within a short walk. Property here holds value because the location cannot be replicated.",
    districtBody2:
      "Schools, a university, a hospital and the main streets of the city sit around the Gorgasali / 26 May intersection. Batumi International Airport is about 15 minutes by car.",
    features: [
      "All-season infrastructure",
      "High-yield investment",
      "Historic center",
      "Courtyard with fountains",
      "Lounge areas",
      "Terraces",
      "Fine dining restaurants, cafes, and bars",
      "Recreational areas",
      "Two-level underground parking",
      "24/7 security & service",
      "Barrier-free environment",
    ],
    materials:
      "8+ Seismic Resilience: Monolithic RC frame. Panoramic, energy-efficient glazing with sound and UV protection: Floor-to-ceiling energy packages. Glazing UV and noise protection: Aluminum double glazing. Elevators (Otis/Kone): High-speed passenger lifts. Climate systems: Central climate adaptation.",
    photos: [
      // Building (render 5 first)
      "/projects/piazza/for-sale/ext-render-5.jpg",
      "/projects/piazza/for-sale/ext-building-1.jpg",
      "/projects/piazza/for-sale/ext-building-3.jpg",
      "/projects/piazza/for-sale/ext-building-4.jpg",
      "/projects/piazza/for-sale/ext-building-6.jpg",
      "/projects/piazza/for-sale/ext-building-7.jpg",
      "/projects/piazza/for-sale/ext-building-10.jpg",
      "/projects/piazza/for-sale/ext-yard-07.jpg",
      // Reception
      "/projects/piazza/marketing/reception-01.jpg",
      "/projects/piazza/marketing/reception-02.jpg",
      "/projects/piazza/marketing/reception-03.jpg",
      "/projects/piazza/marketing/reception-04.jpg",
      "/projects/piazza/marketing/reception-05.jpg",
      "/projects/piazza/marketing/reception-06.jpg",
      // Apartment
      "/projects/piazza/interiors/apartment-01.jpg",
    ],
    // Mosaic showreel: building → yard → reception → apartment → building
    galleryPreview: [
      "/projects/piazza/for-sale/ext-render-5.jpg",
      "/projects/piazza/for-sale/ext-yard-07.jpg",
      "/projects/piazza/marketing/reception-01.jpg",
      "/projects/piazza/interiors/apartment-01.jpg",
      "/projects/piazza/for-sale/ext-building-1.jpg",
    ],
    cardImage: "/projects/piazza/for-sale/ext-render-5.jpg",
    lat: 41.64573,
    lng: 41.63408,
    mapsQuery: "Piazza Residence, 59-61 Vakhtang Gorgasali St, Batumi",
    floorPlans: [
      "/projects/piazza/floor-plans/layout-studio.jpg",
      "/projects/piazza/floor-plans/layout-1br.jpg",
      "/projects/piazza/floor-plans/layout-2br.jpg",
      "/projects/piazza/floor-plans/layout-3br.jpg",
    ],
    floorPlanLabels: ["Studio", "1 BD", "2 BD", "3 BD"],
    floorPlanAreas: ["35.7 m²", "53.5 m²", "76.9 m²", "134 m²"],
    pricePerSqm: "from $2,450/m²",
    propertyType: "apartment",
  },
  {
    name: "Artex Parkline",
    slug: "artex-parkline",
    tag: "New Boulevard · Park Front",
    city: "Batumi",
    address: "Angisa 1st lane, 35b, Batumi",
    seaDistance: "10 minutes to the sea",
    seaMeters: "800 m",
    location: "New Boulevard, Angisa 1st lane 35b · 10 min to the sea",
    desc: "Parkline by Artex is a family-oriented city-within-a-city residence on Batumi’s New Boulevard, featuring three 26–28 floor towers around a landscaped courtyard with a pool, spa, kindergarten, and coworking.",
    yield: "9–11%",
    developer: "Artex",
    architect: "Roman Aphakidze",
    priceFrom: "From $52,480",
    priceUSD: 52480,
    completion: "Q2 2029",
    area: "32–71 m²",
    ceilingHeight: "2.9 m",
    floors: "26–28",
    buildings: "3",
    finishing: "White frame",
    installment: "30% / 70%",
    propertyType: "apartment",
    downPaymentPct: 30,
    constructionProgress: {
      activeIndex: 0,
      stages: [
        { id: "foundation", year: 2026 },
        { id: "construction", year: 2027 },
        { id: "facade", year: 2028 },
        { id: "handover", year: 2029 },
      ],
    },
    developerLogo: "/projects/parkline/brand/developer-logo.png",
    developerBody:
      "Artex is a Batumi developer behind Parkline — a mixed-use complex on the New Boulevard with hotel-grade infrastructure, jet-grouted foundations and seismic design above the mandatory standard.",
    districtTitle: "New Boulevard",
    districtBody:
      "The New Boulevard is Batumi’s greenest and fastest-growing seaside district. Unlike the busy old town and center, it offers a calmer, family-oriented environment featuring a new park avenue, the expansive Lech and Maria Kaczynski Park, and the nearby coastline. Cafes, shops, and sports facilities are all within easy reach, while Batumi International Airport is just an 8-minute drive.",
    features: [
      "All-season infrastructure",
      "Commercial & coworking hub",
      "Smart living tech",
      "24/7 security & service",
      "Underground parking for 120 cars",
      "Indoor pool",
      "Outdoor pool",
      "Gym",
      "Spa",
      "Pharmacy",
      "Cinema",
      "Kindergarten",
      "Playground",
      "Pet zone with paw-wash",
      "High-yield investment",
    ],
    materials:
      "8+ Seismic Resilience: Monolithic RC frame. Facade & insulation: Ventilated coastal hydro/thermal facade. Glazing UV and noise protection: Aluminum double-glazed windows. Elevators (Otis/Kone): High-speed with backup power. Climate systems: Central VRV/VRF and ventilation. White frame: Screed, plaster, wiring, plumbing points.",
    photos: [
      // Building renders
      "/projects/parkline/for-sale/ext-park-hero.jpg",
      "/projects/parkline/for-sale/ext-entrance-branded.jpg",
      "/projects/parkline/for-sale/ext-03.jpg",
      "/projects/parkline/for-sale/ext-pool-deck.jpg",
      "/projects/parkline/for-sale/ext-13.jpg",
      "/projects/parkline/for-sale/ext-22.jpg",
      "/projects/parkline/for-sale/ext-playground.jpg",
      "/projects/parkline/for-sale/ext-16.jpg",
      "/projects/parkline/for-sale/ext-terrace-sunset.jpg",
      "/projects/parkline/for-sale/ext-sunset-towers.jpg",
      "/projects/parkline/for-sale/ext-night-aerial.jpg",
      // Indoor pool before reception
      "/projects/parkline/marketing/int-pool-lounge.jpg",
      // Reception & common interiors
      "/projects/parkline/marketing/int-lobby.jpg",
      "/projects/parkline/marketing/int-lobby-2.jpg",
      "/projects/parkline/marketing/int-reception-2.jpg",
      "/projects/parkline/marketing/int-reception-1.jpg",
      "/projects/parkline/marketing/int-kids-play.jpg",
      // Apartments
      "/projects/parkline/interiors/int-2br-live.jpg",
      "/projects/parkline/interiors/int-living-wood.jpg",
      "/projects/parkline/interiors/int-studio.jpg",
      "/projects/parkline/interiors/int-1br.jpg",
      "/projects/parkline/interiors/int-kitchen.jpg",
      "/projects/parkline/interiors/int-2br-bed.jpg",
      "/projects/parkline/interiors/int-bedroom-soft.jpg",
    ],
    // Mosaic showreel: house → outdoor → reception → apartment → outdoor
    galleryPreview: [
      "/projects/parkline/for-sale/ext-park-hero.jpg",
      "/projects/parkline/for-sale/ext-pool-deck.jpg",
      "/projects/parkline/marketing/int-reception-2.jpg",
      "/projects/parkline/interiors/int-2br-live.jpg",
      "/projects/parkline/for-sale/ext-16.jpg",
    ],
    cardImage: "/projects/parkline/for-sale/ext-park-hero.jpg",
    lat: 41.6282308808277,
    lng: 41.60779103914824,
    floorPlans: [
      "/projects/parkline/floor-plans/layout-studio.jpg",
      "/projects/parkline/floor-plans/layout-516.jpg",
      "/projects/parkline/floor-plans/layout-559.jpg",
      "/projects/parkline/floor-plans/layout-629.jpg",
    ],
    floorPlanLabels: ["Studio", "1 BD", "2 BD", "3 BD"],
    pricePerSqm: "from $1,300/m²",
    liveCameraUrl: "https://rtsp.me/embed/NYD67ak2/",
    panoramaUrl: "https://tour.panoee.net/69f77826c2c57195733b52a5/parkline-13-fl",
  },
  {
    name: "Rogantini Swiss Village",
    slug: "rogantini-swiss-village",
    tag: "Chakvi · Alpine Quality",
    city: "Chakvi",
    address: "Chakvi, suburb of Batumi · 15 minutes by car",
    seaDistance: "5 minutes to the beach",
    seaMeters: "400 m",
    location: "Chakvi, suburb of Batumi · 15 minutes by car",
    desc: "An ultra-premium boutique development by Rogantini Development, a Swiss holding founded in 1967. Set on a private 1.5-hectare hill in the pristine suburb of Chakvi, the complex offers 360° panoramic views of the Black Sea, mountains, and Batumi. The project focuses on Swiss construction precision and uncompromising climate protection.",
    yield: "8–11%",
    developer: "Rogantini Development",
    architect: "Alessandro Rogantini x Valerie Gogaba",
    priceFrom: "From €93,684",
    priceUSD: 101400,
    completion: "Q4 2027",
    area: "34.1–193.6 m²",
    ceilingHeight: "3 m",
    floors: "2–12",
    buildings: "3",
    finishing: "Turnkey",
    climateAdaptation: "Yes",
    installment: "30% / 70%",
    propertyType: "apartment-aparthotel",
    developerBody:
      "Rogantini Development is a Swiss holding founded in 1967, bringing alpine construction precision and climate protection standards to boutique residences on Georgia’s Black Sea coast.",
    districtTitle: "Chakvi",
    districtBody:
      "Chakvi (a suburb of Batumi, 15 minutes by car) is a quiet, green resort area known for its pristine ecology. Unlike the bustling center of Batumi, there is no dense high‑rise development here, and the air is exceptionally fresh (AQI index around 20) thanks to the surrounding eucalyptus and citrus groves.",
    features: [
      "Mountain & sea panoramic views",
      "All-season infrastructure",
      "Clean air · 20 AQI",
      "Wellness & SPA",
      "Private poker room",
      "Conference rooms",
      "Coworking areas",
      "24/7 security & service",
      "Underground parking",
      "Padel courts, children's play areas, and sports grounds",
      "Beach shuttle service",
      "350 m² swimming pools",
      "Outdoor cinema",
      "Pet area",
      "BBQ-zone",
    ],
    materials:
      "Anti-Mold Facade: Swiss climate-protection cladding. 9+ Seismic Resilience: Structural design above code. Deep foundation: Engineered hill foundations. Knauf noise insulation: Acoustic partitions. Schüco Glazing: Premium aluminum systems.",
    photos: [
      // Building / outdoor
      "/projects/rogantini/for-sale/ext-hero.jpg",
      "/projects/rogantini/for-sale/ext-outdoor-01.jpg",
      "/projects/rogantini/for-sale/ext-outdoor-02.jpg",
      "/projects/rogantini/for-sale/ext-view-real.jpg",
      // Reception
      "/projects/rogantini/marketing/reception-01.jpg",
      "/projects/rogantini/marketing/reception-02.jpg",
      "/projects/rogantini/marketing/reception-03.jpg",
      // Apartments
      "/projects/rogantini/interiors/apartment-01.jpg",
      "/projects/rogantini/interiors/apartment-02.jpg",
      "/projects/rogantini/interiors/apartment-03.jpg",
      "/projects/rogantini/interiors/apartment-04.jpg",
      "/projects/rogantini/interiors/apartment-05.jpg",
      "/projects/rogantini/interiors/apartment-06.jpg",
      "/projects/rogantini/interiors/apartment-07.jpg",
      "/projects/rogantini/interiors/apartment-08.jpg",
    ],
    galleryPreview: [
      "/projects/rogantini/for-sale/ext-hero.jpg",
      "/projects/rogantini/for-sale/ext-outdoor-02.jpg",
      "/projects/rogantini/marketing/reception-02.jpg",
      "/projects/rogantini/interiors/apartment-01.jpg",
      "/projects/rogantini/for-sale/ext-view-real.jpg",
    ],
    cardImage: "/projects/rogantini/for-sale/ext-hero.jpg",
    lat: 41.726315131195776,
    lng: 41.744580906746044,
    mapsQuery: "41.726315131195776,41.744580906746044",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from €2,485–€4,735/m²",
    awards: [
      {
        src: "/projects/rogantini/brand/lla-winner-2026.png",
        alt: "Luxury Lifestyle Awards 2026 — Best Luxury Residential Development, Georgia",
      },
    ],
    liveCameraUrl: undefined,
  },
  {
    name: "Silk Towers",
    slug: "silk-towers",
    tag: "Old Batumi · First Line",
    city: "Batumi",
    address: "Black Sea Blvd, 1",
    seaDistance: "1–2 minutes to the sea",
    seaMeters: "100 m",
    location: "Old Batumi · 100 m to the sea",
    desc: "Silk Towers is a signature residential project by Kengo Kuma, a globally recognized architect and a leading figure among international starchitects. Located on historic land and developed by a trusted Georgian developer, the project brings together refined architecture, private waterfront lifestyle, and a complete destination ecosystem: a yacht club, a premium casino, and a large municipal park.",
    yield: "10–13%",
    developer: "Silk Development",
    architect: "KKAA, Masu Planning",
    priceFrom: "From $106,933",
    priceUSD: 106933,
    completion: "Q4 2029",
    area: "27.8–72.3 m²",
    ceilingHeight: "3 m",
    floors: "40–47",
    buildings: "4",
    finishing: "Turnkey",
    climateAdaptation: "Yes",
    installment: "30% / 70%",
    propertyType: "aparthotel",
    trophyProperty: true,
    developerLogo: "/projects/silk/brand/developer-logo.png",
    districtTitle: "Old Batumi",
    districtBody:
      "Old Batumi is the city's cultural and entertainment core: the historic Piazza, central park, restaurants, boutiques and the seaside boulevard are all within a short walk. Property here holds value because the location cannot be replicated.",
    districtBody2:
      "Schools, a university, a hospital and the main streets of the city sit around the Gorgasali / 26 May intersection. Batumi International Airport is about 15 minutes by car.",
    features: [
      "Mountain & sea panoramic views",
      "All-season infrastructure",
      "World-class 5 star hotel",
      "Full managed Property",
      "KKAA masterpiece",
      "Performance hall",
      "Panoramic rooftop",
      "Wellness & SPA",
      "Gym",
      "Private parking",
      "24/7 security & service",
      "Urban Park by Masu Planning",
      "Private yacht club",
      "Padel and tennis courts",
      "Retail promenade, fine dinings",
      "Children's play area",
      "Outdoor pool",
    ],
    materials:
      "Advanced Facade Protection: Coastal-grade envelope systems. 9+ Seismic Resilience: Structural design above code. Deep foundation: Engineered foundations for high-rise towers. Anti-Mold Facade: Climate-protection cladding. Noise insulation: Acoustic partitions throughout residential floors.",
    ownershipBenefits: {
      title: "Silk Rewards",
      body: "When you purchase an apartment at Silk Towers, you are automatically granted Silk Rewards Gold Status. Silk Rewards is a loyalty app that offers real, everyday benefits across all Silk Hospitality venues.",
      linkLabel: "Your benefits here",
      popupItems: [
        "10% cashback on every payment",
        "Earn and redeem points across all locations",
        "Book hotels and restaurants at the best available rates",
        "Access exclusive offers and personalized benefits",
        "Redeem points for a variety of services (hotel stays, restaurants, pool access, and more)",
        "Enjoy bonuses and special gifts as a program member",
      ],
    },
    photos: [
      // Building renders
      "/projects/silk/for-sale/ext-01.jpg",
      "/projects/silk/for-sale/ext-02.jpg",
      "/projects/silk/for-sale/ext-03.jpg",
      "/projects/silk/for-sale/ext-04.jpg",
      "/projects/silk/for-sale/ext-05.jpg",
      "/projects/silk/for-sale/ext-06.jpg",
      "/projects/silk/for-sale/ext-07.jpg",
      // Outdoor
      "/projects/silk/marketing/outdoor-01.jpg",
      "/projects/silk/marketing/outdoor-02.jpg",
      "/projects/silk/marketing/outdoor-03.jpg",
      "/projects/silk/marketing/outdoor-04.jpg",
      "/projects/silk/marketing/outdoor-05.jpg",
      "/projects/silk/marketing/outdoor-06.jpg",
      "/projects/silk/marketing/outdoor-07.jpg",
      "/projects/silk/marketing/outdoor-08.jpg",
      "/projects/silk/marketing/outdoor-09.jpg",
      "/projects/silk/marketing/outdoor-10.jpg",
      "/projects/silk/marketing/outdoor-11.jpg",
      // Turnkey
      "/projects/silk/interiors/turnkey-01.jpg",
      "/projects/silk/interiors/turnkey-02.jpg",
      "/projects/silk/interiors/turnkey-03.jpg",
    ],
    galleryPreview: [
      "/projects/silk/for-sale/ext-01.jpg",
      "/projects/silk/marketing/outdoor-01.jpg",
      "/projects/silk/interiors/turnkey-01.jpg",
      "/projects/silk/marketing/outdoor-08.jpg",
      "/projects/silk/for-sale/ext-05.jpg",
    ],
    cardImage: "/projects/silk/for-sale/card.jpg",
    lat: 41.65629557228978,
    lng: 41.64222436579087,
    mapsQuery: "41.65629557228978,41.64222436579087",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from $3,654/m²",
    liveCameraUrl: undefined,
  },
  {
    name: "VR Shekvetili Forest Beach",
    slug: "shekvetili-forest-beach",
    listedInCatalog: false,
    tag: "Black Sea · Forest & Beach",
    city: "Shekvetili",
    address: "Shekvetili, Guria · next to Paragraph Resort & Spa",
    seaDistance: "1 minute to the beach",
    seaMeters: "50 m",
    location: "Shekvetili · 1,200 m private beach · pine forest",
    desc: "A year-round Black Sea resort between a pine forest and 1,200 metres of private sand beach. Studios to penthouses and villas beside Paragraph Resort & Spa, with a seaside boulevard, Café del Mar beach club, wellness and cycling paths across a 40-hectare masterplan.",
    yield: "12–15%",
    developer: "VR Holding",
    architect: "NS Studio",
    priceFrom: "From $61,910",
    priceUSD: 61910,
    completion: "Q4 2029",
    area: "26–161.3 m²",
    ceilingHeight: "3 m",
    floors: "2–11",
    buildings: "32",
    finishing: "Turnkey (Block A) / Green frame",
    climateAdaptation: "Yes",
    installment: "30% / 70%",
    propertyType: "apartment-aparthotel",
    developerBody:
      "VR Holding develops destination projects on Georgia’s Black Sea coast. VR Shekvetili Forest Beach sits next to Paragraph Resort & Spa (Autograph Collection) and is positioned for both lifestyle buyers and rental investors.",
    districtTitle: "Shekvetili",
    districtBody:
      "Shekvetili is a pine-forest resort strip on the Black Sea between Batumi and Kobuleti — quiet shoreline, resort hotels and growing year-round tourism infrastructure.",
    districtBody2:
      "Batumi International Airport is about 50 minutes by car. The project’s private beach, boulevard and forest trails create a self-contained resort environment.",
    features: [
      "Sea panoramic views",
      "Cafe Del Mar",
      "1.2 km Coastline",
      "All-season infrastructure",
      "Full managed Property",
      "Pine Forest",
      "Panoramic rooftop",
      "Performance hall",
      "Business Lounge",
      "Wellness & SPA",
      "Air Conditioned Rest Area",
      "Indoor pool",
      "Fitness Center",
      "Private parking",
      "24/7 security & service",
      "Private yacht club",
      "Sports area",
      "Fine dinings",
      "Children's play area",
      "Cycling path",
      "Outdoor pool",
      "Bars & Clubs",
    ],
    materials:
      "Advanced Facade Protection: Coastal-grade envelope systems. 9+ Seismic Resilience: Structural design above code. Anti-Mold Facade: Climate-protection cladding. Noise insulation: Acoustic partitions throughout residential floors.",
    photos: [
      // Building & outdoor
      "/projects/shekvetili/for-sale/ext-01.jpg",
      "/projects/shekvetili/for-sale/ext-02.jpg",
      "/projects/shekvetili/for-sale/ext-03.jpg",
      "/projects/shekvetili/for-sale/ext-04.jpg",
      "/projects/shekvetili/for-sale/ext-05.jpg",
      "/projects/shekvetili/for-sale/ext-06.jpg",
      "/projects/shekvetili/for-sale/ext-07.jpg",
      "/projects/shekvetili/for-sale/ext-08.jpg",
      "/projects/shekvetili/for-sale/ext-09.jpg",
      "/projects/shekvetili/for-sale/ext-10.jpg",
      "/projects/shekvetili/for-sale/ext-11.jpg",
      "/projects/shekvetili/for-sale/ext-12.jpg",
      "/projects/shekvetili/for-sale/ext-13.jpg",
      "/projects/shekvetili/for-sale/ext-14.jpg",
      "/projects/shekvetili/for-sale/ext-15.jpg",
      "/projects/shekvetili/for-sale/ext-16.jpg",
      "/projects/shekvetili/for-sale/ext-17.jpg",
      // Lobby & bar
      "/projects/shekvetili/lobby/lobby-01.jpg",
      "/projects/shekvetili/lobby/lobby-02.jpg",
      "/projects/shekvetili/lobby/lobby-03.jpg",
      "/projects/shekvetili/lobby/lobby-04.jpg",
      "/projects/shekvetili/lobby/lobby-05.jpg",
      // Turnkey
      "/projects/shekvetili/interiors/turnkey-01.jpg",
      "/projects/shekvetili/interiors/turnkey-02.jpg",
      "/projects/shekvetili/interiors/turnkey-03.jpg",
      "/projects/shekvetili/interiors/turnkey-04.jpg",
      "/projects/shekvetili/interiors/turnkey-05.jpg",
      "/projects/shekvetili/interiors/turnkey-06.jpg",
    ],
    // Mosaic: hero outdoor-1; left outdoor-4 + outdoor-16; right lobby(2) + outdoor-3
    galleryPreview: [
      "/projects/shekvetili/for-sale/ext-01.jpg",
      "/projects/shekvetili/for-sale/ext-04.jpg",
      "/projects/shekvetili/lobby/lobby-01.jpg",
      "/projects/shekvetili/for-sale/ext-16.jpg",
      "/projects/shekvetili/for-sale/ext-03.jpg",
    ],
    cardImage: "/projects/shekvetili/for-sale/card.jpg",
    lat: 41.9273,
    lng: 41.7684,
    mapsQuery: "VR Shekvetili Forest Beach, Shekvetili, Georgia",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from $1,218/m²",
    awards: [
      {
        src: "/projects/shekvetili/brand/epa-winner-2024-2025.svg",
        alt: "European Property Awards 2024–2025 — Award Winner, Mixed Use Development",
      },
    ],
  },
  {
    name: "Krtsanisi Resort Residence",
    slug: "krtsanisi-resort-residence",
    listedInCatalog: false,
    tag: "Krtsanisi · City Within a City",
    city: "Tbilisi",
    address: "Grigol Volski St 7, Krtsanisi, Tbilisi",
    seaDistance: "15 min to Freedom Square",
    seaMeters: "Inland",
    location: "Krtsanisi diplomatic district · 20 ha resort community",
    desc: "Tbilisi’s first resort-style “city within a city” on 20 hectares in the prestigious Krtsanisi diplomatic quarter. About 70% of the land is gardens, terraces and recreation — French, tropical and Japanese landscapes, pools and sports courts — with apartments, townhouses, penthouses and a multifunctional hotel-style building.",
    yield: "10–14%",
    developer: "VR Holding",
    architect: "TBA",
    priceFrom: "From $100,990",
    priceUSD: 100990,
    completion: "Q3 2026",
    area: "32.6–519.7 m²",
    ceilingHeight: "3.0 m",
    floors: "6–8",
    buildings: "6 phases · 20 ha",
    finishing: "Green frame",
    installment: "30% / 70%",
    developerBody:
      "VR Holding is one of Georgia’s leading developers with a multi-billion portfolio spanning Tbilisi and the Black Sea coast — including Krtsanisi Resort Residence, Vake Sky Tower and Shekvetili Forest~Beach.",
    districtTitle: "Krtsanisi",
    districtBody:
      "Krtsanisi is Tbilisi’s green diplomatic quarter at the bend of the Kura: embassies, clean air and a resort microclimate, yet only 10–15 minutes from the city’s business and cultural core.",
    districtBody2:
      "Freedom Square is about 6 km away; Tbilisi International Airport is roughly 17 km. The National Botanical Garden and Old Tbilisi sit within a short drive.",
    features: [
      "20-hectare resort community",
      "70% landscaped recreation",
      "Diplomatic Krtsanisi address",
      "Pools, courts & gardens",
      "Townhouses & pool penthouses",
      "Multifunctional hotel-style building",
      "City & hill panoramas",
      "Phased delivery (phases 1–4 complete)",
    ],
    materials:
      "Monolithic-frame construction with ventilated natural stone façades and energy-efficient glazing. Units are sold in green-frame condition across a multi-phase masterplan.",
    photos: [
      "/projects/krtsanisi/for-sale/ext-01.jpg",
      "/projects/krtsanisi/for-sale/ext-02.jpg",
      "/projects/krtsanisi/for-sale/ext-03.jpg",
      "/projects/krtsanisi/for-sale/ext-04.jpg",
      "/projects/krtsanisi/for-sale/ext-05.jpg",
      "/projects/krtsanisi/for-sale/ext-06.jpg",
      "/projects/krtsanisi/for-sale/ext-07.jpg",
      "/projects/krtsanisi/for-sale/ext-08.jpg",
      "/projects/krtsanisi/for-sale/ext-09.jpg",
      "/projects/krtsanisi/progress/progress-01.jpg",
      "/projects/krtsanisi/progress/progress-02.jpg",
      "/projects/krtsanisi/progress/progress-03.jpg",
      "/projects/krtsanisi/progress/progress-04.jpg",
    ],
    cardImage: "/projects/krtsanisi/for-sale/card.jpg",
    lat: 41.6685,
    lng: 44.8452,
    mapsQuery: "VR Krtsanisi Resort Residence, Grigol Volski Street 7, Tbilisi",
    floorPlans: [
      "/projects/krtsanisi/floor-plans/layout-1.jpg",
      "/projects/krtsanisi/floor-plans/layout-2.jpg",
      "/projects/krtsanisi/floor-plans/layout-3.jpg",
      "/projects/krtsanisi/floor-plans/layout-4.jpg",
    ],
    floorPlanLabels: ["Block 36", "Block 37", "Block 38", "Block 39"],
    pricePerSqm: "from $2,050/m²",
  },
  {
    name: "Vake Sky Tower",
    slug: "vake-sky-tower",
    listedInCatalog: false,
    tag: "Vake · Tallest in Georgia",
    city: "Tbilisi",
    address: "49 Ilia Chavchavadze Ave, Vake, Tbilisi",
    seaDistance: "Opposite Vake Park",
    seaMeters: "Inland",
    location: "Vake · Chavchavadze Ave · Fashion Avenue",
    desc: "Georgia’s tallest tower — about 260 m and ~70 floors — on Chavchavadze Avenue opposite Vake Park. A multifunctional landmark with branded residences, Fashion Avenue retail, a Class A business centre, spa, pools and hotel-grade services in Tbilisi’s most prestigious district.",
    yield: "8–12%",
    developer: "VR Holding",
    architect: "TBA",
    priceFrom: "From $110,600",
    priceUSD: 110600,
    completion: "Q3 2029",
    area: "31.6–113.2 m²",
    ceilingHeight: "3.0 m",
    floors: "70 · ~260 m",
    buildings: "1",
    finishing: "Turnkey / hotel-style apartments",
    installment: "30% / 70%",
    developerBody:
      "VR Holding is delivering Vake Sky Tower as a new economic and cultural landmark for Tbilisi — residences with hotel services, Fashion Avenue and a Class A business centre on the site of the former Sports University.",
    districtTitle: "Vake",
    districtBody:
      "Vake is Tbilisi’s most prestigious residential district: Chavchavadze Avenue, Vake Park, Turtle Lake, universities, embassies and high-end retail within walking distance.",
    districtBody2:
      "Mikheil Meskhi Stadium, the Philharmonic and the city’s main cultural venues are nearby. The tower is designed as a self-sufficient urban hub with sports, shopping and business infrastructure.",
    features: [
      "Tallest building in Georgia (~260 m)",
      "Opposite Vake Park",
      "Fashion Avenue luxury retail",
      "Class A business centre",
      "Hotel-style branded apartments",
      "Spa, fitness & infinity pool",
      "24/7 concierge & security",
      "Sports university infrastructure",
    ],
    materials:
      "International high-rise engineering with energy-efficient façade systems, centralised technical cores and premium hotel-grade interiors for branded residences.",
    photos: [
      "/projects/vake-sky/for-sale/ext-01.jpg",
      "/projects/vake-sky/for-sale/entrance.jpg",
      "/projects/vake-sky/marketing/fashion-avenue.jpg",
      "/projects/vake-sky/marketing/business-center.jpg",
      "/projects/vake-sky/marketing/lobby.jpg",
      "/projects/vake-sky/marketing/lobby-bar.jpg",
      "/projects/vake-sky/marketing/pool.jpg",
      "/projects/vake-sky/marketing/terrace.jpg",
      "/projects/vake-sky/marketing/terrace-night.jpg",
      "/projects/vake-sky/for-sale/sides.jpg",
      "/projects/vake-sky/for-sale/ext-02.jpg",
      "/projects/vake-sky/interiors/apt-01.jpg",
      "/projects/vake-sky/interiors/apt-02.jpg",
    ],
    cardImage: "/projects/vake-sky/for-sale/card.jpg",
    lat: 41.7094,
    lng: 44.7573,
    mapsQuery: "VR Vake Sky Tower, 49 Chavchavadze Avenue, Tbilisi",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from $3,100/m²",
  },
  {
    name: "Ambassadori Island",
    slug: "ambassadori-island",
    listedInCatalog: false,
    tag: "Off-Shore Island · Marina",
    city: "Batumi",
    address: "Batumi Bay, off-shore island",
    seaDistance: "Waterfront",
    seaMeters: "0 m",
    location: "Off-shore island, Batumi Bay · Private marina access",
    desc: "An 87-hectare man-made archipelago redefining luxury through eco-futurism. With 49% green infrastructure, a premier yacht club, and an elite private university — a sustainable sanctuary where technology meets nature.",
    yield: "12–14.5%",
    developer: "Ambassadori Holdings",
    architect: "TBA",
    priceFrom: "From $180,000",
    priceUSD: 180000,
    completion: "Q2 2027",
    area: "60–350 m²",
    ceilingHeight: "3.3 m",
    floors: "30",
    buildings: "8",
    finishing: "White frame, Turnkey, Designer",
    installment: "30% / 70%",
    features: [
      "87-ha man-made archipelago",
      "49% green infrastructure",
      "Premier yacht club",
      "Elite private university",
      "High-end global brand retail",
    ],
    materials: "Eco-certified materials, solar infrastructure, smart building systems throughout.",
    photos: ["/projects/ambassadori/for-sale/card.png", "/home/hero1.png", "/home/card-new.png"],
    cardImage: "/projects/ambassadori/for-sale/card.png",
    lat: 41.6190,
    lng: 41.6550,
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "Coming Soon",
    liveCameraUrl: undefined,
  },
  {
    name: "Gonio Yachts & Marina",
    slug: "gonio-yachts-marina",
    listedInCatalog: false,
    tag: "Gonio · Waterfront",
    city: "Gonio",
    address: "Gonio, 15 km from Batumi",
    seaDistance: "Direct waterfront",
    seaMeters: "0 m",
    location: "Gonio, 15 km from Batumi · Direct waterfront",
    desc: "A private marina complex combining branded residences with resort hospitality infrastructure. Berths, a yacht club, and a waterfront promenade in one of Georgia's most scenic coastal settings.",
    yield: "11–14%",
    developer: "Marina Developments Georgia",
    architect: "TBA",
    priceFrom: "From $150,000",
    priceUSD: 150000,
    completion: "Q1 2028",
    area: "55–180 m²",
    ceilingHeight: "3.0 m",
    floors: "14",
    buildings: "3",
    finishing: "White frame, Turnkey",
    installment: "30% / 70%",
    features: [
      "Private marina with berths",
      "Branded residences",
      "Yacht club membership",
      "Waterfront promenade",
      "Resort hospitality services",
    ],
    materials: "Marine-grade materials, teak decking, panoramic floor-to-ceiling facades.",
    photos: ["/projects/gonio/for-sale/card.png", "/projects/gonio/for-sale/marina.png", "/home/lifestyle-coast.png"],
    cardImage: "/projects/gonio/for-sale/card.png",
    lat: 41.5481,
    lng: 41.6218,
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "Coming Soon",
    liveCameraUrl: undefined,
  },

];

/** Projects visible in /catalog and public listings. */
export function isListedInCatalog(p: Project): boolean {
  return p.listedInCatalog !== false;
}

export function catalogListedProjects(list: Project[] = projects): Project[] {
  return list.filter(isListedInCatalog);
}
