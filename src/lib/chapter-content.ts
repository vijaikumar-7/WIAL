import type { ChapterDraftInput, ChapterDraftOutput } from "@/lib/types";

const TONE_GUIDANCE: Record<string, string> = {
  English: "Use concise, credible, nonprofit-professional English with calm confidence.",
  Portuguese: "Use Brazilian Portuguese with professional warmth, clear value statements, and practical tone.",
  French: "Use formal but clear French suitable for executive readers.",
  Spanish: "Use clear, direct Spanish appropriate for professional services."
};

export function generateChapterDraftFallback(input: ChapterDraftInput): ChapterDraftOutput {
  const tone = TONE_GUIDANCE[input.language] ?? "Use a professional, low-flash, globally credible tone.";
  const coachList =
    input.selectedCoaches.length > 0
      ? input.selectedCoaches.slice(0, 3).join(", ")
      : "our local WIAL coach community";

  return {
    heroTitle:
      input.language === "Portuguese"
        ? `${input.chapterName}: liderança e aprendizagem em ação`
        : `${input.chapterName}: Action Learning for real organizational challenges`,
    heroSubtitle:
      input.language === "Portuguese"
        ? `${input.valueProposition}. Conteúdo local, identidade global e foco em resultados práticos.`
        : `${input.valueProposition}. Global WIAL standards, local relevance, and a practical route into Action Learning.`,
    overview:
      input.language === "Portuguese"
        ? `${input.chapterName} existe para apoiar líderes e equipes em ${input.region} com uma experiência local, consistente com a marca global da WIAL. ${input.localContext}`
        : `${input.chapterName} exists to support leaders and teams in ${input.region} with a local chapter experience that still reflects WIAL’s global standards. ${input.localContext}`,
    eventTeaser:
      input.language === "Portuguese"
        ? `Próximo destaque: ${input.eventTitle}. Uma oportunidade prática para conhecer coaches, metodologia e próximos passos da certificação.`
        : `Upcoming highlight: ${input.eventTitle}. A practical way to meet coaches, understand the method, and see what certification pathways look like locally.`,
    coachSpotlight:
      input.language === "Portuguese"
        ? `Destaques do capítulo: ${coachList}. A vitrine do capítulo deve permanecer editável, mas governada pelo template global.`
        : `Coach spotlight: ${coachList}. The chapter roster should stay editable locally while remaining inside the shared global template.`,
    testimonialBlock:
      input.language === "Portuguese"
        ? `Depoimento do capítulo: “${input.testimonial}”`
        : `Chapter testimony: “${input.testimonial}”`,
    callToAction:
      input.language === "Portuguese"
        ? "Fale com o capítulo, encontre um coach e acompanhe os próximos eventos."
        : "Contact the chapter, discover a coach, and follow upcoming events.",
    toneNotes: [tone, "Keep claims factual. Do not invent local events, achievements, or verified coach credentials."],
    warnings: [
      "Human review required before publish.",
      "Do not auto-publish generated public content.",
      "Replace generic proof points with verified chapter-specific details."
    ],
    reviewRequired: true
  };
}
