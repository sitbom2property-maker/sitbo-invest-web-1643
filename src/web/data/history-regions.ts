export type TimelineEvent = {
  year: string;
  title: string;
  body: string;
};

export type HistoryRegion = {
  id: string;
  name: string;
  tag: string;
  status: "live" | "soon";
  intro: string;
  events: TimelineEvent[];
};

/** Georgia regions timeline — Batumi first; more regions later. */
export const HISTORY_REGIONS: HistoryRegion[] = [
  {
    id: "batumi",
    name: "Batumi",
    tag: "Black Sea · Adjara",
    status: "live",
    intro:
      "From a historic port city to one of Europe's highest-yield coastal markets — the milestones that shaped Batumi as an investment destination.",
    events: [
      {
        year: "1878",
        title: "Port city opens to the world",
        body: "Batumi becomes a free port. Trade routes and early urban fabric set the city's coastal identity for the century ahead.",
      },
      {
        year: "2004–2012",
        title: "Modern skyline begins",
        body: "Post-reform investment transforms the waterfront. Hotels, boulevards, and high-rises redefine Batumi as a Black Sea resort capital.",
      },
      {
        year: "2015",
        title: "Tourism crosses a tipping point",
        body: "International arrivals accelerate. Short-term rental demand starts to reshape residential product along the first and second lines.",
      },
      {
        year: "2018",
        title: "Foreign buyers enter at scale",
        body: "Open ownership rules and simple registration attract regional capital. Off-plan sales become a core market engine.",
      },
      {
        year: "2021",
        title: "Yield leadership goes global",
        body: "Batumi repeatedly ranks among the world's top cities for rental yield — drawing yield-focused investors from Europe, the Gulf, and CIS.",
      },
      {
        year: "2023",
        title: "Infrastructure compresses the discount",
        body: "Boulevard extension, airport growth, and coastal road upgrades pull Gonio–Chakvi–Makhinjauri into the Batumi investment map.",
      },
      {
        year: "2025",
        title: "A mature coastal market",
        body: "Transaction volumes and foreign participation rise. Location, developer quality, and management — not just price — decide returns.",
      },
      {
        year: "2026",
        title: "Still early. Still cheap.",
        body: "Average pricing remains far below Mediterranean peers, while tourism and residency pathways keep Batumi structurally attractive.",
      },
    ],
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    tag: "Capital · Coming soon",
    status: "soon",
    intro: "Capital-city timeline for long-hold investors — launching next.",
    events: [],
  },
];

export const LIVE_REGION =
  HISTORY_REGIONS.find((r) => r.status === "live") ?? HISTORY_REGIONS[0];
