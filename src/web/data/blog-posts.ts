export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: BlogBlock[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "batumi-real-estate-2026",
    title: "Batumi Real Estate 2026: What Every Foreign Investor Must Know Before Buying",
    author: "Arthur Arutyunyan",
    date: "May 2026",
    readTime: "7 min read",
    category: "Market Analysis",
    excerpt: "Batumi recorded $1.3B in property transactions in 2025. Foreign buyers now account for 52% of sales. The era of buying anything and profiting is over — here is what replaced it.",
    content: [
      { type: "paragraph", text: "Batumi is no longer a frontier market. In 2025, the city recorded $1.3 billion in property transactions — a 24% jump year-over-year. Foreign buyers now account for 52% of all apartment sales. The era of \"buy anything and profit\" is over. What replaced it is more interesting: a mature market where location, developer quality, and timing determine whether you make 8% or 14% annually." },
      { type: "paragraph", text: "This guide gives you the unfiltered picture — numbers from Galt & Taggart, Global Property Guide, and seven years of on-the-ground experience closing deals in Batumi, Gonio, Chakvi, and Makhinjauri." },
      { type: "heading", text: "The Market in Numbers: 2025 Results and 2026 Outlook" },
      { type: "paragraph", text: "Total apartment sales reached 17,478 units in 2025 — a 15% increase year-over-year. Market size expanded to $1.3 billion (+24% annually). Primary price growth hit 9.4% YoY in 2025, but is forecast to slow to 4–6% in 2026. Average rental yield compressed from 8.8% in 2024 to 7.4% in 2025 as supply grew faster than rental rates. Foreign buyers now represent 52% of all transactions — up from 41% in 2023." },
      { type: "paragraph", text: "What this tells you: 2026 is a consolidation year. Price growth is slowing. Rental yields are compressing slightly as supply grows. This does not mean stop buying — it means buy smarter." },
      { type: "heading", text: "Where Prices Actually Are Right Now" },
      { type: "paragraph", text: "The range in Batumi is wide. Understanding it is the difference between a good deal and an overpay." },
      { type: "list", items: [
        "First line / seafront (0–150m from sea): $1,800–$3,000+ per sqm. Old Batumi exceeds $3,000/sqm for premium product. These properties command the highest short-term rental rates ($80–150/night in peak season).",
        "Second line (150–500m from sea): $1,200–$1,800 per sqm. The sweet spot for yield-focused investors. Lower entry, still strong rental demand.",
        "Peripheral zones: Below $1,500/sqm. Higher risk — liquidity depends entirely on infrastructure development nearby.",
        "Entry budgets: Studio, no finishing, second line from $45,000–55,000. Finished apartment with sea view from $70,000. Business class from $150,000+."
      ]},
      { type: "heading", text: "Rental Yields: The Honest Version" },
      { type: "paragraph", text: "Every agency will quote you 10–14% yields. Here is what the data actually shows. Short-term rental yields in Batumi range from 4.6% to 9.96% depending on location, with a city average of 7.28% (Global Property Guide, Q1 2025). For premium seafront properties under professional management, yields reach 15–16% — but these are outliers, not the norm." },
      { type: "list", items: [
        "Seafront, premium: 15–20% gross short-term yield",
        "Downtown / New Boulevard: 10–14% gross",
        "Second line, residential areas: 8–12% gross",
        "Peripheral zones: 5–8% gross"
      ]},
      { type: "paragraph", text: "The keyword is gross. Net yields after management fees (typically 20–25% of revenue), utilities, and vacancies run 3–5% lower. A well-managed seafront property netting 11–13% annually is a realistic and excellent outcome. Average daily rental rates in 2025 were $35.6 — broadly flat year-on-year despite rising property prices. This is why yields compressed." },
      { type: "heading", text: "The Three Districts Every Investor Should Know in 2026" },
      { type: "paragraph", text: "New Boulevard led Batumi with over 6,800 transactions in 2025 — the city\'s most active district. Strong short-term rental demand from tourists. Best for investors who want liquidity and consistent occupancy. Risk: oversupply in mid-range segment." },
      { type: "paragraph", text: "Alley of Heroes recorded nearly 4,000 units sold in 2025. Growing infrastructure, slightly lower prices than the seafront, longer-term stability. Best for 3–5 year hold with moderate rental income." },
      { type: "paragraph", text: "Gonio, Chakvi, and Makhinjauri — this is where SITBO focuses most of its off-market sourcing. Three infrastructure catalysts are reshaping these locations: the Batumi Bypass Road cuts travel time from Gonio to the center to 15 minutes; the New Boulevard extension transforms residential outskirts into recreational coastal zones; and the airport expansion makes Gonio a high-demand transit zone. Projected price appreciation: 15–20% over 3–5 years in road-adjacent zones." },
      { type: "heading", text: "What Changed in 2026 That You Must Know" },
      { type: "paragraph", text: "Residency threshold increased to $150,000. Effective March 1, 2026, the minimum property value required to obtain Georgian residency through real estate purchase increased from $100,000 to $150,000 — a 50% increase. Multiple properties can be combined to reach the threshold." },
      { type: "paragraph", text: "Stricter building regulations. Georgia tightened seismic stability and height requirements in 2025. This raises construction costs — but it also means new completions in 2026–2027 are structurally superior to what was built in 2020–2022." },
      { type: "paragraph", text: "Branded residence trend. The highest-performing assets in 2025–2026 are complexes managed by international hotel brands. Wyndham, Marriott, and Hilton-managed properties demonstrate maximum occupancy rates. This format commands a 20–30% premium over standalone apartments." },
      { type: "heading", text: "The Due Diligence Questions No One Else Asks" },
      { type: "paragraph", text: "After seven years and hundreds of transactions, these are the questions that separate a good investment from a problem." },
      { type: "list", items: [
        "On the developer: How many projects have they completed on time? What is the average delay? Do they have active litigation with previous buyers?",
        "On the project: What is the legal land status — owned or leased? Are all building permits issued, or is the project selling on a preliminary permit?",
        "On rental economics: Who manages the short-term rental, and what is their actual occupancy history — not projected? What are management fees, utility costs, and annual maintenance charges?",
        "On exit: Who are the likely buyers in 3–5 years? What is the resale liquidity in this specific micro-location?"
      ]},
      { type: "heading", text: "Why 2026 Is Still a Good Time to Enter" },
      { type: "paragraph", text: "Three structural reasons make Georgia compelling in 2026. First, first-line land is exhausted — the Batumi coastline is functionally built out, making supply constraint structural, not cyclical. Second, European integration trajectory — Georgia\'s EU candidate status attracts institutional capital, and when institutions arrive, individual entry prices rise. Third, tourism continues to grow — 1.7 million tourists visited Batumi in 2025, with airport expansion and the $3 billion artificial island project sustaining demand through the decade." },
      { type: "paragraph", text: "The window is not closing. But it is narrowing in the premium locations. Gonio, Chakvi, and Makhinjauri still offer the entry pricing that central Batumi had in 2020." },
      { type: "heading", text: "The SITBO Perspective" },
      { type: "paragraph", text: "We work with a maximum of twelve client mandates per quarter — not because of capacity constraints, but because due diligence done properly takes time, and we sign off personally on every purchase." },
      { type: "paragraph", text: "In 2026, we are directing clients toward off-market first-line opportunities in Gonio and Makhinjauri (pre-public pricing, 15–20% below comparable listed assets), branded residence projects with proven management operators, and second-line Batumi assets in the $80,000–120,000 range for yield-focused investors. What we are avoiding: mid-tier projects in oversupplied New Boulevard micro-locations, developers with unresolved litigation, and anything with land lease rather than freehold title." },
      { type: "paragraph", text: "If you are considering a Batumi investment in 2026, the single most valuable thing you can do is talk to someone who has closed transactions in the last 90 days — not someone working from a 2024 market report. We offer a free 30-minute strategy call. No catalog, no pressure." },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
