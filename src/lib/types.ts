export type CertificationLevel = "CALC" | "PALC" | "SALC" | "MALC" | null;
export type ApprovalStatus = "APPROVED" | "PENDING" | "REJECTED";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
export type KnowledgeType = "journal" | "webinar";

export interface CoachRecord {
  id: string;
  name: string;
  headline: string;
  company: string | null;
  locationText: string;
  countrySlug: string;
  countryName: string;
  citySlug: string | null;
  cityName: string | null;
  chapterSlug: string;
  chapterName: string;
  region: string;
  profileUrl: string | null;
  externalUrl: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  about: string;
  languages: string[];
  languageCodes: string[];
  certificationLevel: CertificationLevel;
  certificationLabel: string;
  approvalStatus: ApprovalStatus;
  sourceType: "csv-import" | "manual";
  searchKeywords: string[];
  searchDocument: string;
  dataCompleteness: number;
  sourceGapFlags: string[];
}

export interface ChapterRecord {
  slug: string;
  name: string;
  region: string;
  primaryLanguage: string;
  coachCount: number;
  heroTitle: string;
  heroSubtitle: string;
  about: string;
  focusAreas: string[];
  contactEmail: string;
  featuredEventTitle: string;
  featuredEventDate: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  organizationalClients: string[];
  themeLocked: boolean;
  status: "active" | "template-ready";
}

export interface EventRecord {
  id: string;
  title: string;
  chapterSlug: string;
  chapterName: string;
  date: string;
  format: "virtual" | "in-person" | "hybrid";
  location: string;
  audience: string;
  summary: string;
}

export interface InvoiceLineItem {
  label: string;
  unitAmount: number;
  quantity: number;
}

export interface InvoiceRecord {
  id: string;
  chapterSlug: string;
  chapterName: string;
  periodLabel: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: "USD";
  lineItems: InvoiceLineItem[];
  reminderSentAt: string | null;
  receiptNumber: string | null;
  notes: string;
}

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  title: string;
  summary: string;
  plainLanguageSummary: string;
  keyFindings: string[];
  tags: string[];
  languages: string[];
  sourceUrl: string;
  promoSeed: string;
}

export interface CertificationTrack {
  level: "CALC" | "PALC" | "SALC" | "MALC";
  title: string;
  hours: string;
  audience: string;
  summary: string;
  requirements: string[];
  cta: string;
}

export interface SearchCriteria {
  rawQuery: string;
  normalizedQuery: string;
  languages: string[];
  countrySlugs: string[];
  certificationLevel: CertificationLevel;
  sectors: string[];
  topics: string[];
  chapterSlug: string | null;
  limit: number;
}

export interface RankedCoachMatch {
  coach: CoachRecord;
  score: number;
  matchedFacets: string[];
  caution: string[];
}

export interface SearchResponse {
  criteria: SearchCriteria;
  explanation: string;
  matches: RankedCoachMatch[];
  usedFallback: boolean;
  lowConfidence: boolean;
}

export interface MatchResponse extends SearchResponse {
  fallbackChapter: ChapterRecord | null;
  extractedNeed: string;
}

export interface ChapterDraftInput {
  chapterSlug?: string;
  chapterName: string;
  region: string;
  language: string;
  valueProposition: string;
  localContext: string;
  selectedCoaches: string[];
  eventTitle: string;
  testimonial: string;
}

export interface ChapterDraftOutput {
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  eventTeaser: string;
  coachSpotlight: string;
  testimonialBlock: string;
  callToAction: string;
  toneNotes: string[];
  warnings: string[];
  reviewRequired: boolean;
}

export interface KnowledgeResponse {
  query: string;
  answer: string;
  matchedItems: KnowledgeItem[];
  generatedPromo: string;
  lowConfidence: boolean;
}
