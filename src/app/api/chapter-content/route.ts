import { NextResponse } from "next/server";
import { z } from "zod";
import { getCoaches } from "@/lib/data";
import { generateChapterDraftFallback } from "@/lib/chapter-content";
import type { ChapterDraftInput, ChapterDraftOutput } from "@/lib/types";
import { requestStructuredOutput } from "@/lib/server/openai";

const bodySchema = z.object({
  chapterSlug: z.string().trim().optional(),
  chapterName: z.string().trim().min(2),
  region: z.string().trim().min(2),
  language: z.string().trim().min(2),
  valueProposition: z.string().trim().min(10),
  localContext: z.string().trim().min(10),
  selectedCoaches: z.array(z.string().trim()).max(3).default([]),
  eventTitle: z.string().trim().min(3),
  testimonial: z.string().trim().min(10)
});

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heroTitle: { type: "string" },
    heroSubtitle: { type: "string" },
    overview: { type: "string" },
    eventTeaser: { type: "string" },
    coachSpotlight: { type: "string" },
    testimonialBlock: { type: "string" },
    callToAction: { type: "string" },
    toneNotes: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 6
    },
    warnings: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 6
    },
    reviewRequired: { type: "boolean" }
  },
  required: [
    "heroTitle",
    "heroSubtitle",
    "overview",
    "eventTeaser",
    "coachSpotlight",
    "testimonialBlock",
    "callToAction",
    "toneNotes",
    "warnings",
    "reviewRequired"
  ]
} as const;

function buildPrompt(input: ChapterDraftInput) {
  const selectedCoachRows = getCoaches()
    .filter((coach) => input.selectedCoaches.includes(coach.name))
    .slice(0, 3)
    .map((coach) => ({
      name: coach.name,
      location: coach.locationText,
      languages: coach.languages,
      caution: coach.sourceGapFlags
    }));

  return {
    systemPrompt:
      "You are helping draft WIAL chapter homepage copy. You must stay professional, neutral, globally credible, and low-flash. Never invent certifications, client logos, chapter maturity, event details, or coach specializations that are not explicitly provided. Always assume human review is required before publishing.",
    userPrompt: JSON.stringify(
      {
        request: "Generate culturally adapted chapter homepage copy draft.",
        constraints: [
          "Do not output flashy marketing language.",
          "Do not auto-publish; return reviewRequired true.",
          "Keep tone calm, executive, and nonprofit-professional.",
          "If facts are sparse, state that verification is needed in warnings rather than inventing details."
        ],
        input,
        selectedCoachRows
      },
      null,
      2
    )
  };
}

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const fallback = generateChapterDraftFallback(body);

    try {
      const prompt = buildPrompt(body);
      const generated = await requestStructuredOutput<ChapterDraftOutput>({
        schemaName: "WialChapterDraft",
        schema: outputSchema,
        systemPrompt: prompt.systemPrompt,
        userPrompt: prompt.userPrompt,
        temperature: 0.4,
        maxOutputTokens: 1200
      });

      if (generated) {
        return NextResponse.json({
          ...generated,
          warnings: Array.from(new Set([...(generated.warnings || []), ...fallback.warnings])),
          reviewRequired: true
        });
      }
    } catch {
      // Safe fallback below.
    }

    return NextResponse.json(fallback);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid chapter generation request."
      },
      { status: 400 }
    );
  }
}
