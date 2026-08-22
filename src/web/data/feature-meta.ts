export type FeatureCategory = "lot" | "indoor" | "outdoor" | "construction";

export type ProjectFeatureItem = {
  id: string;
  label: string;
  category: FeatureCategory;
  icon: FeatureIconId;
};

export type FeatureIconId =
  | "sea"
  | "mountain"
  | "beach"
  | "panorama"
  | "pool"
  | "gym"
  | "cinema"
  | "elevator"
  | "parking"
  | "balcony"
  | "court"
  | "park"
  | "security"
  | "hotel"
  | "shop"
  | "kids"
  | "spa"
  | "office"
  | "yacht"
  | "building"
  | "grouting"
  | "moisture"
  | "seismic"
  | "generic";

type Rule = {
  category: FeatureCategory;
  icon: FeatureIconId;
  test: RegExp;
};

const RULES: Rule[] = [
  { category: "lot", icon: "sea", test: /sea|seaside|waterfront|black sea|boulevard/i },
  { category: "lot", icon: "beach", test: /beach|sand beach|beach club|café del mar|cafe del mar/i },
  { category: "lot", icon: "mountain", test: /mountain|hill panorama|city & hill/i },
  { category: "lot", icon: "panorama", test: /panoramic|scenic|glazing|views/i },
  { category: "lot", icon: "park", test: /park|forest|landscap|green|garden|recreation|hectare|archipelago/i },
  { category: "lot", icon: "building", test: /address|boulevard|historic|monument|new build|tower|tallest|fa[cç]ade|ventilated|concrete|construction|phased|university|diplomatic|vake|resort community|masterplan/i },
  { category: "outdoor", icon: "pool", test: /outdoor pool|infinity pool|pools?,?\s*courts|pool & wellness|pools,/i },
  { category: "outdoor", icon: "court", test: /tennis|basketball|court|sport/i },
  { category: "outdoor", icon: "yacht", test: /yacht|marina|berth/i },
  { category: "outdoor", icon: "balcony", test: /balcony|terrace|rooftop/i },
  { category: "outdoor", icon: "parking", test: /parking/i },
  { category: "outdoor", icon: "kids", test: /play area|children|kindergarten|pet zone/i },
  { category: "indoor", icon: "pool", test: /indoor pool|spa with indoor/i },
  { category: "indoor", icon: "gym", test: /gym|fitness|wellness|spa(?! with)/i },
  { category: "indoor", icon: "cinema", test: /cinema|poker/i },
  { category: "indoor", icon: "elevator", test: /elevator|lift/i },
  { category: "indoor", icon: "office", test: /cowork|office|business centre|business center/i },
  { category: "indoor", icon: "hotel", test: /concierge|reception|hotel|branded|hospitality|casino|manager/i },
  { category: "indoor", icon: "shop", test: /restaurant|café|cafe|retail|store|fashion|food/i },
  { category: "indoor", icon: "security", test: /security|gated|24\/7/i },
];

function classify(label: string): { category: FeatureCategory; icon: FeatureIconId } {
  for (const rule of RULES) {
    if (rule.test.test(label)) return { category: rule.category, icon: rule.icon };
  }
  return { category: "outdoor", icon: "generic" };
}

export function normalizeProjectFeatures(features: string[]): ProjectFeatureItem[] {
  return features.map((label, index) => {
    const { category, icon } = classify(label);
    return {
      id: `${index}-${label.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
      label,
      category,
      icon,
    };
  });
}

function constructionIcon(label: string): FeatureIconId {
  if (/jet|grout|цемент|грунт|soilcrete/i.test(label)) return "grouting";
  if (/moisture|влаг|корроз|hydro|водо/i.test(label)) return "moisture";
  if (/seismic|сейсм|earthquake|землетряс/i.test(label)) return "seismic";
  if (/concrete|бетон|frame|каркас|fa[cç]ade|фасад|glazing|остек/i.test(label)) return "building";
  return "generic";
}

/** Shorten titled materials lines into compact Construction labels. */
function normalizeConstructionLabel(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (/moisture|влаг|корроз/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Защита от влаги" : "Moisture protection";
  }
  if (/seismic|сейсм/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Сейсмостойкость" : "Seismic resilience";
  }
  if (/jet\s*grout/i.test(t)) return "Jet Grouting";
  return t.replace(/\s*&\s*/g, " & ");
}

/**
 * Pull Construction items from Materials & Construction copy.
 * Prefers "Title: body" sentences; otherwise skips unstructured prose.
 */
export function parseConstructionFeatures(materials: string | undefined | null): ProjectFeatureItem[] {
  if (!materials?.trim()) return [];

  const chunks = materials
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const titled = chunks
    .map((chunk) => {
      const colon = chunk.indexOf(":");
      if (colon <= 0 || colon > 48) return null;
      const rawLabel = chunk.slice(0, colon).trim();
      if (!rawLabel) return null;
      return normalizeConstructionLabel(rawLabel);
    })
    .filter((x): x is string => Boolean(x));

  if (titled.length === 0) return [];

  return titled.map((label, index) => ({
    id: `construction-${index}-${label.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
    label,
    category: "construction" as const,
    icon: constructionIcon(label),
  }));
}

export const FEATURE_CATEGORY_ORDER: FeatureCategory[] = ["lot", "indoor", "outdoor", "construction"];
