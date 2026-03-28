import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getInvoices } from "@/lib/data";

const bodySchema = z.object({
  invoiceId: z.string().trim().min(1)
});

function invoiceTotalAmount(lineItems: { unitAmount: number; quantity: number }[]) {
  return lineItems.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
}

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const invoice = getInvoices().find((entry) => entry.id === body.invoiceId);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({
        mode: "mock",
        url: null,
        message: "Stripe sandbox keys are not configured. Staying in demo mode."
      });
    }

    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/admin?payment=success&invoice=${invoice.id}`,
      cancel_url: `${origin}/admin?payment=cancelled&invoice=${invoice.id}`,
      line_items: invoice.lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: invoice.currency.toLowerCase(),
          unit_amount: item.unitAmount * 100,
          product_data: {
            name: item.label,
            description: `${invoice.chapterName} • ${invoice.periodLabel}`
          }
        }
      })),
      metadata: {
        invoiceId: invoice.id,
        chapterSlug: invoice.chapterSlug,
        chapterName: invoice.chapterName,
        total: String(invoiceTotalAmount(invoice.lineItems))
      }
    });

    return NextResponse.json({
      mode: "stripe",
      url: session.url,
      message: "Stripe sandbox session created."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to start checkout session."
      },
      { status: 400 }
    );
  }
}
