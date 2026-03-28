import { getChapterBySlug } from "@/lib/data";
import type {
  ChapterRecord,
  CoachRecord,
  MatchResponse,
  RankedCoachMatch,
  SearchCriteria,
  SearchResponse
} from "@/lib/types";
import { normalizeText, unique } from "@/lib/utils";

const COUNTRY_SYNONYMS: Record<string, string[]> = {
  brazil: ["brazil", "brasil", "brazilian", "sao paulo", "são paulo"],
  "united-states": ["usa", "us", "united states", "america", "american"],
  poland: ["poland", "polish", "warsaw", "gdansk", "gdańsk"],
  malaysia: ["malaysia", "malay", "kuala lumpur"],
  netherlands: ["netherlands", "dutch", "amsterdam", "barneveld"],
  thailand: ["thailand", "thai", "bangkok"],
  singapore: ["singapore"],
  vietnam: ["vietnam", "vietnamese", "ho chi minh"],
  china: ["china", "chinese", "shanghai"],
  "hong-kong": ["hong kong"],
  france: ["france", "french", "paris"],
  philippines: ["philippines", "filipino", "manila"],
  cambodia: ["cambodia", "khmer", "phnom penh"],
  nigeria: ["nigeria", "lagos"],
  "united-kingdom": ["united kingdom", "uk", "britain", "british"],
  ireland: ["ireland", "irish"],
  "south-africa": ["south africa"],
  canada: ["canada", "canadian"],
  taiwan: ["taiwan"],
  syria: ["syria", "arabic", "middle east"]
};

const LANGUAGE_SYNONYMS: Record<string, string[]> = {
  English: ["english"],
  Portuguese: ["portuguese", "português", "portugues", "brasil", "brazilian portuguese"],
  French: ["french", "français", "francais"],
  Polish: ["polish", "polski"],
  Dutch: ["dutch", "nederlands"],
  Malay: ["malay", "bahasa melayu", "bahasa"],
  Mandarin: ["mandarin", "chinese", "中文"],
  Cantonese: ["cantonese"],
  Thai: ["thai"],
  Vietnamese: ["vietnamese"],
  Filipino: ["filipino", "tagalog"],
  Khmer: ["khmer"],
  Arabic: ["arabic"]
};

const CERTIFICATION_SYNONYMS: Record<"CALC" | "PALC" | "SALC" | "MALC", string[]> = {
  CALC: ["calc", "certified action learning coach"],
  PALC: ["palc", "professional action learning coach"],
  SALC: ["salc", "senior action learning coach"],
  MALC: ["malc", "master action learning coach"]
};

const TOPIC_SYNONYMS: Record<string, string[]> = {
  manufacturing: ["manufacturing", "industrial", "factory", "supply chain", "operations"],
  leadership: ["leadership", "leaders", "leader development", "executive"],
  "team dynamics": ["team dynamics", "team", "collaboration", "cross-functional", "group effectiveness"],
  government: ["government", "public sector", "policy"],
  healthcare: ["healthcare", "hospital", "patient", "clinical"],
  nonprofit: ["nonprofit", "ngo", "social impact", "charity"],
  technology: ["tech", "technology", "startup", "digital", "software"],
  finance: ["finance", "bank", "banking", "financial services"],
  education: ["education", "university", "faculty", "learning"],
  translation: ["multilingual", "translation", "cross-lingual", "language"]
};

function includesAny(value: string, variants: string[]) {
  return variants.some((variant) => value.includes(normalizeText(variant)));
}

function extractCountries(query: string) {
  return Object.entries(COUNTRY_SYNONYMS)
    .filter(([, variants]) => includesAny(query, variants))
    .map(([country]) => country);
}

function extractLanguages(query: string) {
  return Object.entries(LANGUAGE_SYNONYMS)
    .filter(([, variants]) => includesAny(query, variants))
    .map(([language]) => language);
}

function extractCertification(query: string) {
  const match = Object.entries(CERTIFICATION_SYNONYMS).find(([, variants]) => includesAny(query, variants));
  return match ? (match[0] as SearchCriteria["certificationLevel"]) : null;
}

function extractTopics(query: string) {
  return Object.entries(TOPIC_SYNONYMS)
    .filter(([, variants]) => includesAny(query, variants))
    .map(([topic]) => topic);
}

export function buildCriteria(
  rawQuery: string,
  options: Partial<Pick<SearchCriteria, "chapterSlug" | "limit">> = {}
): SearchCriteria {
  const normalizedQuery = normalizeText(rawQuery || "");
  return {
    rawQuery,
    normalizedQuery,
    languages: extractLanguages(normalizedQuery),
    countrySlugs: extractCountries(normalizedQuery),
    certificationLevel: extractCertification(normalizedQuery),
    sectors: extractTopics(normalizedQuery),
    topics: extractTopics(normalizedQuery),
    chapterSlug: options.chapterSlug ?? null,
    limit: options.limit ?? 8
  };
}

function computeCoachScore(criteria: SearchCriteria, coach: CoachRecord): RankedCoachMatch {
  let score = 0;
  const matchedFacets: string[] = [];
  const caution: string[] = [];
  const coachText = normalizeText(coach.searchDocument);
  const keywordBlob = normalizeText(coach.searchKeywords.join(" "));

  if (!criteria.normalizedQuery) {
    score += 10;
  }

  if (criteria.chapterSlug && coach.chapterSlug === criteria.chapterSlug) {
    score += 24;
    matchedFacets.push(`chapter: ${coach.chapterName}`);
  }

  for (const country of criteria.countrySlugs) {
    if (coach.countrySlug === country) {
      score += 28;
      matchedFacets.push(`country: ${coach.countryName}`);
    }
  }

  for (const language of criteria.languages) {
    if (coach.languages.includes(language)) {
      score += 22;
      matchedFacets.push(`language: ${language}`);
    }
  }

  if (criteria.certificationLevel) {
    if (coach.certificationLevel === criteria.certificationLevel) {
      score += 18;
      matchedFacets.push(`certification: ${criteria.certificationLevel}`);
    } else if (!coach.certificationLevel) {
      caution.push("Certification level not available in imported source.");
    }
  }

  for (const topic of criteria.topics) {
    const variants = TOPIC_SYNONYMS[topic] || [topic];
    if (variants.some((variant) => coachText.includes(normalizeText(variant)))) {
      score += 12;
      matchedFacets.push(`topic: ${topic}`);
    }
  }

  const queryTokens = unique(
    criteria.normalizedQuery
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2)
  );

  for (const token of queryTokens) {
    if (coachText.includes(token) || keywordBlob.includes(token)) {
      score += 3;
    }
  }

  if (coach.phone) {
    score += 1;
  }

  if (coach.dataCompleteness < 0.5) {
    caution.push("Imported record has limited public metadata.");
  }

  return {
    coach,
    score,
    matchedFacets: unique(matchedFacets),
    caution: unique(caution)
  };
}

function buildExplanation(criteria: SearchCriteria, matches: RankedCoachMatch[]) {
  if (!criteria.rawQuery.trim()) {
    return "Showing all publicly imported coach records with verification status preserved from the CSV import.";
  }

  const topMatch = matches[0];
  if (!topMatch) {
    return "No strong directory match was found. The safest fallback is to route the user to the relevant chapter or WIAL Global.";
  }

  const facets = topMatch.matchedFacets.length
    ? topMatch.matchedFacets.slice(0, 3).join(", ")
    : "broad text overlap in the imported directory";
  return `Top matches were ranked using language, location, chapter context, and public-directory text overlap. Strongest facets: ${facets}.`;
}

export function searchCoaches(
  rawQuery: string,
  coaches: CoachRecord[],
  options: Partial<Pick<SearchCriteria, "chapterSlug" | "limit">> = {}
): SearchResponse {
  const criteria = buildCriteria(rawQuery, options);
  const ranked = coaches
    .map((coach) => computeCoachScore(criteria, coach))
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, criteria.limit);

  const lowConfidence =
    ranked.length === 0 ||
    ranked.every((result) => result.matchedFacets.length === 0) ||
    criteria.topics.some(
      (topic) => !ranked.some((result) => result.matchedFacets.some((facet) => facet.includes(topic)))
    );

  return {
    criteria,
    explanation: buildExplanation(criteria, ranked),
    matches: ranked,
    usedFallback: true,
    lowConfidence
  };
}

function chooseFallbackChapter(criteria: SearchCriteria): ChapterRecord | null {
  const preferredChapter = criteria.chapterSlug ?? criteria.countrySlugs[0] ?? null;
  return preferredChapter ? getChapterBySlug(preferredChapter) : null;
}

export function matchCoaches(rawQuery: string, coaches: CoachRecord[]): MatchResponse {
  const search = searchCoaches(rawQuery, coaches, { limit: 5 });
  const fallbackChapter = chooseFallbackChapter(search.criteria);
  return {
    ...search,
    extractedNeed: rawQuery,
    fallbackChapter
  };
}
