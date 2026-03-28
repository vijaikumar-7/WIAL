const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";

type JsonSchema = Record<string, unknown>;

function extractResponseText(payload: any): string | null {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (Array.isArray(payload?.output)) {
    for (const item of payload.output) {
      if (Array.isArray(item?.content)) {
        for (const part of item.content) {
          if (typeof part?.text === "string" && part.text.trim()) {
            return part.text;
          }
          if (part?.parsed && typeof part.parsed === "object") {
            return JSON.stringify(part.parsed);
          }
        }
      }
    }
  }

  return null;
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function requestStructuredOutput<T>({
  schemaName,
  schema,
  systemPrompt,
  userPrompt,
  temperature = 0.2,
  maxOutputTokens = 1200
}: {
  schemaName: string;
  schema: JsonSchema;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      store: false,
      temperature,
      max_output_tokens: maxOutputTokens,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const text = extractResponseText(payload);
  if (!text) return null;

  return JSON.parse(text) as T;
}
