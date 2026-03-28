import { NextResponse } from "next/server";
import { z } from "zod";
import { getCoaches } from "@/lib/data";
import { matchCoaches } from "@/lib/search";

const bodySchema = z.object({
  query: z.string().trim().min(3)
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const results = matchCoaches(body.query, getCoaches());
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid coach matching request."
      },
      { status: 400 }
    );
  }
}
