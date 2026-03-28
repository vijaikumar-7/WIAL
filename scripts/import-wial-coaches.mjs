import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const csvPath = path.join(repoRoot, "data", "wial_coaches.csv");
const outDir = path.join(repoRoot, "src", "lib", "data");

const COUNTRY_NORMALIZATION = { virginia: "united-states", "ho-chi-minh-city": "vietnam" };
const COUNTRY_NAME_OVERRIDES = {
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  "hong-kong": "Hong Kong",
  "south-africa": "South Africa",
  "syrian-arab-republic": "Syria",
  taiwan: "Taiwan"
};
const REGION_MAP = {
  "united-states": "North America",
  canada: "North America",
  brazil: "South America",
  poland: "Europe",
  netherlands: "Europe",
  france: "Europe",
  "united-kingdom": "Europe",
  ireland: "Europe",
  malaysia: "Asia-Pacific",
  singapore: "Asia-Pacific",
  thailand: "Asia-Pacific",
  vietnam: "Asia-Pacific",
  china: "Asia-Pacific",
  "hong-kong": "Asia-Pacific",
  taiwan: "Asia-Pacific",
  philippines: "Asia-Pacific",
  cambodia: "Asia-Pacific",
  "south-africa": "Africa",
  syria: "Middle East"
};
const LANGUAGE_MAP = {
  "united-states": ["English"],
  canada: ["English", "French"],
  brazil: ["Portuguese"],
  poland: ["Polish", "English"],
  netherlands: ["Dutch", "English"],
  france: ["French", "English"],
  "united-kingdom": ["English"],
  ireland: ["English"],
  malaysia: ["Malay", "English"],
  singapore: ["English", "Mandarin"],
  thailand: ["Thai", "English"],
  vietnam: ["Vietnamese", "English"],
  china: ["Mandarin", "English"],
  "hong-kong": ["Cantonese", "English"],
  taiwan: ["Mandarin", "English"],
  philippines: ["Filipino", "English"],
  cambodia: ["Khmer", "English"],
  "south-africa": ["English"],
  syria: ["Arabic", "English"]
};
const LANGUAGE_CODES = {
  English: "en",
  French: "fr",
  Portuguese: "pt",
  Polish: "pl",
  Dutch: "nl",
  Malay: "ms",
  Mandarin: "zh",
  Thai: "th",
  Vietnamese: "vi",
  Cantonese: "yue",
  Filipino: "fil",
  Khmer: "km",
  Arabic: "ar"
};
const CHAPTER_EDITORIAL = {
  nigeria: {
    name: "WIAL Nigeria",
    region: "Africa",
    primaryLanguage: "English",
    heroTitle: "Action Learning for West African leadership teams",
    heroSubtitle: "A chapter template focused on credibility, local events, and low-bandwidth access.",
    about: "WIAL Nigeria is one of the clearest examples of why chapter governance matters: local relevance with global brand consistency.",
    focusAreas: ["Leadership development", "Team effectiveness", "Corporate transformation"],
    contactEmail: "global@wial.org",
    featuredEventTitle: "Certified Action Learning Foundations Session",
    featuredEventDate: "2026-05-14",
    testimonialQuote: "Action Learning gave our leadership team a practical way to solve live business problems together.",
    testimonialAuthor: "Regional chapter participant",
    organizationalClients: ["Financial services", "Public sector", "Energy"]
  },
  "united-states": {
    name: "WIAL USA",
    region: "North America",
    primaryLanguage: "English",
    heroTitle: "A chapter platform built for scale across the U.S.",
    heroSubtitle: "Consistent branding, chapter-level events, and a governed global directory.",
    about: "The U.S. chapter is the strongest example of a larger affiliate that benefits from template inheritance and editorial zones.",
    focusAreas: ["Corporate learning", "Higher education", "Nonprofit leadership"],
    contactEmail: "global@wial.org",
    featuredEventTitle: "Action Learning for complex organizational change",
    featuredEventDate: "2026-06-10",
    testimonialQuote: "The chapter model finally makes local content visible without fragmenting the WIAL brand.",
    testimonialAuthor: "U.S. affiliate director",
    organizationalClients: ["Healthcare systems", "Universities", "Technology firms"]
  },
  brazil: {
    name: "WIAL Brazil",
    region: "South America",
    primaryLanguage: "Portuguese",
    heroTitle: "Aprendizagem em ação com identidade local",
    heroSubtitle: "Conteúdo de capítulo culturalmente adaptado, sem perder a consistência global da marca.",
    about: "Brazil is the ideal chapter to demonstrate multilingual discovery and culturally adapted content generation.",
    focusAreas: ["Leadership development", "Operational excellence", "Team learning"],
    contactEmail: "global@wial.org",
    featuredEventTitle: "Sessão aberta de Action Learning para líderes de equipes",
    featuredEventDate: "2026-06-03",
    testimonialQuote: "A nova plataforma facilita descobrir coaches e divulgar eventos locais com muito mais clareza.",
    testimonialAuthor: "Participante do capítulo",
    organizationalClients: ["Industrial teams", "Healthcare", "Financial services"]
  }
};

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    return headers.reduce((acc, header, index) => {
      acc[header] = (cells[index] || "").trim();
      return acc;
    }, {});
  });
}

function slugify(value) {
  return decodeURIComponent(String(value || ""))
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u00C0-\u024F]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unknown";
}

function normalizeCountry(slug) {
  const normalized = COUNTRY_NORMALIZATION[slugify(slug)] || slugify(slug);
  return normalized === "syrian-arab-republic" ? "syria" : normalized;
}

function titleizeSlug(slug) {
  if (!slug) return null;
  if (COUNTRY_NAME_OVERRIDES[slug]) return COUNTRY_NAME_OVERRIDES[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

const csv = fs.readFileSync(csvPath, "utf8");
const rows = parseCsv(csv);
const coaches = [];
const chapterMap = new Map();

for (const [index, row] of rows.entries()) {
  const url = row.profile_url || "";
  const parts = decodeURIComponent(new URL(url).pathname).replace(/^\//, "").split("/").filter(Boolean);
  const countrySlug = normalizeCountry(parts[0] || "global");
  const citySlug = parts.includes("coaches") && parts.indexOf("coaches") >= 2 ? slugify(parts[1]) : null;
  const countryName = titleizeSlug(countrySlug);
  const cityName = citySlug ? titleizeSlug(citySlug) : null;
  const chapterName = countrySlug === "united-states" ? "WIAL USA" : `WIAL ${countryName}`;
  const languages = LANGUAGE_MAP[countrySlug] || ["English"];
  const headline = row.subtitle === "Coach’s Contact Information" ? "WIAL directory coach" : row.subtitle || "WIAL directory coach";
  const about = row.about || `Public coach record imported from the WIAL directory export for ${countryName}. Detailed biography and certification level need verification from source systems.`;

  const sourceGapFlags = [];
  if (!row.about) sourceGapFlags.push("missing_bio");
  if (!row.phone) sourceGapFlags.push("missing_phone");
  if (!row.email) sourceGapFlags.push("missing_email");
  sourceGapFlags.push("missing_certification_sync", "missing_verified_specializations");

  const coach = {
    id: `coach-${String(index + 1).padStart(3, "0")}`,
    name: row.name,
    headline,
    company: null,
    locationText: cityName ? `${cityName}, ${countryName}` : countryName,
    countrySlug,
    countryName,
    citySlug,
    cityName,
    chapterSlug: countrySlug,
    chapterName,
    region: REGION_MAP[countrySlug] || "Global",
    profileUrl: url || null,
    externalUrl: url || null,
    phone: row.phone || null,
    email: row.email || null,
    website: null,
    about,
    languages,
    languageCodes: languages.map((language) => LANGUAGE_CODES[language] || "en"),
    certificationLevel: null,
    certificationLabel: "Verification needed",
    approvalStatus: "APPROVED",
    sourceType: "csv-import",
    searchKeywords: [countryName, chapterName, REGION_MAP[countrySlug] || "Global", ...languages].concat(cityName ? [cityName] : []),
    searchDocument: [row.name, headline, about, countryName, cityName || "", chapterName, languages.join(" "), REGION_MAP[countrySlug] || "Global"].filter(Boolean).join(" "),
    dataCompleteness: Number(((10 - sourceGapFlags.length) / 10).toFixed(2)),
    sourceGapFlags
  };

  coaches.push(coach);

  if (!chapterMap.has(countrySlug)) {
    chapterMap.set(countrySlug, []);
  }
  chapterMap.get(countrySlug).push(coach);
}

const editorialFallbacks = {
  heroTitle: "A governed chapter website with local editorial control",
  heroSubtitle: "Consistent WIAL branding, local events, coach discovery, and lightweight performance for global audiences.",
  about: "This chapter page is generated from the shared WIAL template and local chapter metadata. It preserves global brand rules while allowing local content updates.",
  focusAreas: ["Leadership development", "Team effectiveness", "Organizational learning"],
  featuredEventTitle: "Action Learning open house",
  featuredEventDate: "2026-06-20",
  testimonialQuote: "The shared platform gives our chapter a cleaner public presence and a better way to stay aligned with WIAL Global.",
  testimonialAuthor: "Chapter lead",
  organizationalClients: ["Corporate teams", "Public sector", "Education"]
};

const chapterSlugs = new Set([...chapterMap.keys(), ...Object.keys(CHAPTER_EDITORIAL)]);
const chapters = [...chapterSlugs]
  .sort()
  .map((slug) => {
    const editorial = { ...editorialFallbacks, ...(CHAPTER_EDITORIAL[slug] || {}) };
    return {
      slug,
      name: editorial.name || (slug === "united-states" ? "WIAL USA" : `WIAL ${titleizeSlug(slug)}`),
      region: editorial.region || REGION_MAP[slug] || "Global",
      primaryLanguage: editorial.primaryLanguage || (LANGUAGE_MAP[slug] || ["English"])[0],
      coachCount: (chapterMap.get(slug) || []).length,
      heroTitle: editorial.heroTitle,
      heroSubtitle: editorial.heroSubtitle,
      about: editorial.about,
      focusAreas: editorial.focusAreas,
      contactEmail: editorial.contactEmail || "global@wial.org",
      featuredEventTitle: editorial.featuredEventTitle,
      featuredEventDate: editorial.featuredEventDate,
      testimonialQuote: editorial.testimonialQuote,
      testimonialAuthor: editorial.testimonialAuthor,
      organizationalClients: editorial.organizationalClients,
      themeLocked: true,
      status: (chapterMap.get(slug) || []).length ? "active" : "template-ready"
    };
  });

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "imported-coaches.json"), JSON.stringify(coaches, null, 2));
fs.writeFileSync(path.join(outDir, "chapters.json"), JSON.stringify(chapters, null, 2));

console.log(`Imported ${coaches.length} coaches into ${chapters.length} chapters.`);
