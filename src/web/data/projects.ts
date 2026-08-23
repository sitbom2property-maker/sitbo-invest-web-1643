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
  propertyType?: "apartment" | "residence" | "villa" | "townhouse";
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
};

export type PaymentPlan = PaymentSegment[];

/** Resolve displayable payment plans; sitewide standard is 30% / 70%. */
export function resolvePaymentPlans(_p: Project): PaymentPlan[] {
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
    apartmentsKey: "piazza",
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
    downPaymentPct: 30,
    apartmentsKey: "parkline",
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
      "/projects/parkline/for-sale/ext-01.jpg",
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
    tourUrl: "https://flatshow.property/ru/Parkline#/",
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
    finishing: "Turnkey designer finish with European furniture & appliances",
    climateAdaptation: "Yes",
    installment: "30% / 70%",
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
    tag: "First Line · Sea View",
    city: "Batumi",
    address: "Black Sea Blvd, 1",
    seaDistance: "2 minutes to the beach",
    seaMeters: "150 m",
    location: "Black Sea Boulevard, First Line · 2 min to beach",
    desc: "Silk Towers is a signature residential project by Kengo Kuma, a globally recognized architect and a leading figure among international starchitects. Located on historic land and developed by a trusted Georgian developer, the project brings together refined architecture, private waterfront lifestyle, and a complete destination ecosystem: a yacht club, a premium casino, and a large municipal park.",
    yield: "10–13%",
    developer: "Silk Development",
    architect: "KKAA, Masu Planning",
    priceFrom: "From $105,200",
    priceUSD: 105200,
    completion: "Q4 2029",
    area: "26–69 m²",
    ceilingHeight: "3 m",
    floors: "40–47",
    buildings: "4",
    finishing: "Turnkey",
    climateAdaptation: "Yes",
    installment: "30% / 70%",
    trophyProperty: true,
    developerLogo: "/projects/silk/brand/developer-logo.png",
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
    lat: 41.6568,
    lng: 41.6301,
    mapsQuery: "Silk Towers, Batumi",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from $3,300/m²",
    liveCameraUrl: undefined,
  },
  {
    name: "Shekvetili Forest - Beach",
    slug: "shekvetili-forest-beach",
    tag: "Black Sea · Forest & Beach",
    city: "Shekvetili",
    address: "Shekvetili, Guria · next to Paragraph Resort & Spa",
    seaDistance: "1 minute to the beach",
    seaMeters: "50 m",
    location: "Shekvetili · 1,200 m private beach · pine forest",
    desc: "A year-round Black Sea resort between a pine forest and 1,200 metres of private sand beach. Studios to penthouses and villas beside Paragraph Resort & Spa, with a seaside boulevard, Café del Mar beach club, wellness and cycling paths across a 40-hectare masterplan.",
    yield: "12–15%",
    developer: "VR Holding",
    architect: "TBA",
    priceFrom: "From $53,430",
    priceUSD: 53430,
    completion: "Q3 2027",
    area: "26.3–163 m²",
    ceilingHeight: "3.0 m",
    floors: "2–11",
    buildings: "Blocks A, B1, B2, C1, C2",
    finishing: "Turnkey (Block A) / Green frame",
    installment: "30% / 70%",
    developerBody:
      "VR Holding develops destination projects on Georgia’s Black Sea coast. Shekvetili Forest~Beach sits next to Paragraph Resort & Spa (Autograph Collection) and is positioned for both lifestyle buyers and rental investors.",
    districtTitle: "Shekvetili",
    districtBody:
      "Shekvetili is a pine-forest resort strip on the Black Sea between Batumi and Kobuleti — quiet shoreline, resort hotels and growing year-round tourism infrastructure.",
    districtBody2:
      "Batumi International Airport is about 50 minutes by car. The project’s private beach, boulevard and forest trails create a self-contained resort environment.",
    features: [
      "1,200 m private sand beach",
      "40-hectare forest–beach masterplan",
      "Next to Paragraph Resort & Spa",
      "Café del Mar beach club",
      "Seaside boulevard & bike paths",
      "Infinity pools & wellness",
      "Studios to penthouses & villas",
      "Managed resort infrastructure",
    ],
    materials:
      "Coastal-grade construction with panoramic glazing. Block A is delivered turnkey; Blocks B1, B2, C1 and C2 are offered as green frame with optional furniture and appliance packages.",
    photos: [
      "/projects/shekvetili/for-sale/ext-01.jpg",
      "/projects/shekvetili/for-sale/ext-02.jpg",
      "/projects/shekvetili/for-sale/ext-03.jpg",
      "/projects/shekvetili/for-sale/ext-04.jpg",
      "/projects/shekvetili/for-sale/ext-05.jpg",
      "/projects/shekvetili/marketing/beach.jpg",
      "/projects/shekvetili/marketing/drone.jpg",
      "/projects/shekvetili/marketing/pool.jpg",
      "/projects/shekvetili/interiors/interior-01.jpg",
      "/projects/shekvetili/for-sale/blocks.jpg",
      "/projects/shekvetili/marketing/sunset.jpg",
      "/projects/shekvetili/for-sale/genplan.jpg",
      "/projects/shekvetili/interiors/apt-01.jpg",
      "/projects/shekvetili/interiors/apt-02.jpg",
      "/projects/shekvetili/interiors/apt-03.jpg",
    ],
    cardImage: "/projects/shekvetili/for-sale/card.jpg",
    lat: 41.9273,
    lng: 41.7684,
    mapsQuery: "VR Shekvetili Forest Beach, Shekvetili, Georgia",
    floorPlans: [],
    floorPlanLabels: [],
    pricePerSqm: "from $1,800/m²",
    propertyType: "residence",
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
