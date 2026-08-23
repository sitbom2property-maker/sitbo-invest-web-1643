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
  | "fingerprint"
  | "generic";

type Rule = {
  category: FeatureCategory;
  icon: FeatureIconId;
  test: RegExp;
};

const RULES: Rule[] = [
  { category: "lot", icon: "fingerprint", test: /kkaa|masterpiece|шедевр|отпечаток/i },
  { category: "indoor", icon: "office", test: /cowork|commercial|коворкинг|коммерц|performance hall|концертн|зал\s*мероприят/i },
  { category: "indoor", icon: "building", test: /smart living|smart living tech/i },
  { category: "lot", icon: "building", test: /high-?yield|доходност|investment/i },
  { category: "indoor", icon: "parking", test: /private parking|частн.*парк|подземн.*парк/i },
  { category: "outdoor", icon: "parking", test: /parking|паркинг/i },
  { category: "lot", icon: "park", test: /all-season|всесезон|инфраструктур/i },
  { category: "lot", icon: "park", test: /clean air|aqi|чисты.\s*воздух/i },
  { category: "lot", icon: "hotel", test: /5\s*star|five.?star|managed property|full managed|управляем|5\s*зв[её]зд/i },
  { category: "outdoor", icon: "beach", test: /beach shuttle|shuttle to the beach|трансфер на пляж/i },
  { category: "lot", icon: "sea", test: /\bsea\b|seaside|waterfront|black sea|boulevard/i },
  { category: "lot", icon: "beach", test: /beach|sand beach|beach club|café del mar|cafe del mar/i },
  { category: "lot", icon: "mountain", test: /mountain|hill panorama|city & hill|mountain\s*&\s*sea/i },
  { category: "indoor", icon: "balcony", test: /panoramic rooftop|панорамн.*крыш|rooftop lounge/i },
  { category: "lot", icon: "panorama", test: /panoramic|scenic|glazing|views|остеклен/i },
  { category: "lot", icon: "park", test: /\bpark\b|forest|landscap|green|garden|recreation|hectare|archipelago|masu/i },
  { category: "lot", icon: "building", test: /address|boulevard|historic|monument|new build|tower|tallest|fa[cç]ade|ventilated|concrete|construction|phased|university|diplomatic|vake|resort community|masterplan/i },
  { category: "outdoor", icon: "pool", test: /outdoor pool|открытый\s+бассейн|infinity pool|pools?,?\s*courts|pool & wellness|pools,|swimming pool/i },
  { category: "outdoor", icon: "cinema", test: /outdoor cinema|open-?air cinema|летн.*кино|кинотеатр\s*на\s*открыт/i },
  { category: "outdoor", icon: "court", test: /tennis|basketball|padel|\bcourts?\b|sport/i },
  { category: "outdoor", icon: "yacht", test: /yacht|marina|berth/i },
  { category: "outdoor", icon: "balcony", test: /balcony|terrace|rooftop|bbq/i },
  { category: "outdoor", icon: "kids", test: /playground|площадк|play area|pet zone|pet area|питомц|children'?s play/i },
  { category: "indoor", icon: "kids", test: /kindergarten|детский\s+сад|playroom|игровая|children/i },
  { category: "indoor", icon: "pool", test: /indoor pool|крытый\s+бассейн|spa with indoor/i },
  { category: "indoor", icon: "spa", test: /\bspa\b|wellness/i },
  { category: "indoor", icon: "gym", test: /gym|fitness|тренаж/i },
  { category: "indoor", icon: "cinema", test: /cinema|кинотеатр|poker/i },
  { category: "indoor", icon: "elevator", test: /elevator|lift|лифт/i },
  { category: "indoor", icon: "office", test: /office|business centre|business center|conference|конференц|cowork/i },
  { category: "indoor", icon: "hotel", test: /concierge|reception|hotel|branded|hospitality|casino|manager|service 24|сервис 24/i },
  { category: "outdoor", icon: "shop", test: /retail promenade|fine dining|променад|ритейл/i },
  { category: "indoor", icon: "shop", test: /pharmacy|аптек|restaurant|café|cafe|retail|store|fashion|food/i },
  { category: "indoor", icon: "security", test: /security|gated|24\/7|охран/i },
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
  if (/finish|white frame|белы|отдел/i.test(label)) return "building";
  if (/moisture|влаг|корроз|hydro|водо|insulat|изоляц|фасад|facade|noise|шум|anti-?mold/i.test(label)) return "moisture";
  if (/glaz|остек|window|панорам/i.test(label)) return "panorama";
  if (/elevat|лифт|otis|kone/i.test(label)) return "elevator";
  if (/climate|vrv|vrf|климат|ventil/i.test(label)) return "spa";
  if (/seismic|сейсм|earthquake|землетряс|frame|каркас/i.test(label)) return "seismic";
  if (/concrete|бетон|foundation|фундам/i.test(label)) return "building";
  return "generic";
}

/** Shorten titled materials lines into compact Construction labels. */
function normalizeConstructionLabel(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  // Keep long panoramic-glazing copy as-is (used as its own Construction row).
  if (/panoramic|панорамн/i.test(t) && /glaz|остек/i.test(t)) {
    return t.replace(/\s*&\s*/g, " & ");
  }
  if (/anti-?mold|анти.?плесен/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Фасад Anti-Mold" : "Anti-Mold Facade";
  }
  if (/9\s*\+/i.test(t) && /seismic|сейсм|resilience|устойчив/i.test(t)) {
    return /[а-яё]/i.test(t) ? "9+ сейсмическая устойчивость" : "9+ Seismic Resilience";
  }
  if (/deep\s+foundation|глубок.*фундам/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Глубокий фундамент" : "Deep foundation";
  }
  if (/knauf|noise insulation|шумоизоляц/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Шумоизоляция" : "Noise insulation";
  }
  if (/advanced facade|защита фасада/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Защита фасада" : "Advanced Facade Protection";
  }
  if (/sch[uü]co/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Остекление Schüco" : "Schüco Glazing";
  }
  if (/moisture|влаг|корроз/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Защита от влаги" : "Moisture protection";
  }
  if (/finish|white frame|белы/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Белый каркас" : "White frame";
  }
  if (/facade|фасад|insulat|изоляц|noise|шум|advanced facade/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Фасад и изоляция" : "Facade & insulation";
  }
  if (/glaz|остек|uv|шум/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Остекление UV и шумозащита" : "Glazing UV and noise protection";
  }
  if (/elevat|лифт|otis|kone/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Лифты (Otis/Kone)" : "Elevators (Otis/Kone)";
  }
  if (/climate|vrv|климат/i.test(t)) {
    return /[а-яё]/i.test(t) ? "Климат-системы" : "Climate systems";
  }
  if (/8\s*\+|seismic|сейсм|8\s*point|8\s*балл/i.test(t)) {
    return /[а-яё]/i.test(t) ? "8+ сейсмическая устойчивость" : "8+ Seismic Resilience";
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
      // Allow longer titles (e.g. panoramic glazing copy).
      if (colon <= 0 || colon > 96) return null;
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
