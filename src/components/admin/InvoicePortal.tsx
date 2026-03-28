"use client";

import { useMemo, useState } from "react";
import { BellRing, CheckCircle2, CreditCard, Loader2, Mail } from "lucide-react";
import type { InvoiceRecord, InvoiceStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue"
};

function invoiceTotal(invoice: InvoiceRecord) {
  return invoice.lineItems.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
}

export function InvoicePortal({ invoices }: { invoices: InvoiceRecord[] }) {
  const [invoiceState, setInvoiceState] = useState(invoices);
  const [selectedId, setSelectedId] = useState(invoices[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const selectedInvoice = useMemo(
    () => invoiceState.find((invoice) => invoice.id === selectedId) ?? invoiceState[0],
    [invoiceState, selectedId]
  );

  if (!selectedInvoice) return null;

  function updateInvoice(partial: Partial<InvoiceRecord>) {
    setInvoiceState((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoice.id ? { ...invoice, ...partial } : invoice
      )
    );
  }

  function handleReminder() {
    updateInvoice({ reminderSentAt: new Date().toISOString() });
    setMessage(`Reminder logged for ${selectedInvoice.chapterName}.`);
  }

  function handleMarkPaid() {
    updateInvoice({
      status: "paid",
      receiptNumber: selectedInvoice.receiptNumber ?? `RCP-${selectedInvoice.id.toUpperCase()}`
    });
    setMessage(`Invoice marked paid for demo.`);
  }

  async function handleStripeSandbox() {
    setPaymentLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: selectedInvoice.id })
      });

      const payload = (await response.json()) as { mode?: string; url?: string | null; message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to start payment flow.");

      if (payload.url) {
        window.open(payload.url, "_blank", "noopener,noreferrer");
      }

      setMessage(payload.message || (payload.url ? "Stripe sandbox opened." : "Demo mode kept active."));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start payment flow.");
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <section className="surface rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 space-y-2">
        <p className="kicker">Dues / invoice portal</p>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          WIAL-style dues workflow, not course checkout
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted-foreground)]">
          The admin model now reflects WIAL’s stated dues structure. It is deliberately framed as
          invoices to chapters / affiliates instead of direct student checkout.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-3">
          {invoiceState.map((invoice) => (
            <button
              key={invoice.id}
              type="button"
              onClick={() => {
                setSelectedId(invoice.id);
                setMessage(null);
              }}
              className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                invoice.id === selectedInvoice.id
                  ? "border-black/15 bg-white shadow-sm"
                  : "border-black/8 bg-[color:var(--background)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{invoice.chapterName}</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{invoice.periodLabel}</p>
                </div>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs">
                  {STATUS_LABELS[invoice.status]}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-[color:var(--muted-foreground)]">
                <span>Due {formatDate(invoice.dueDate)}</span>
                <span>{formatCurrency(invoiceTotal(invoice), invoice.currency)}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-black/8 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Selected invoice
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {selectedInvoice.chapterName}
              </h3>
              <p className="text-sm text-[color:var(--muted-foreground)]">{selectedInvoice.periodLabel}</p>
            </div>

            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Total due
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {formatCurrency(invoiceTotal(selectedInvoice), selectedInvoice.currency)}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-black/8">
            <table className="min-w-full text-sm">
              <thead className="bg-[color:var(--background)] text-left text-[color:var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Line item</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.lineItems.map((item) => (
                  <tr key={item.label} className="border-t border-black/6">
                    <td className="px-4 py-4">{item.label}</td>
                    <td className="px-4 py-4">{item.quantity}</td>
                    <td className="px-4 py-4">{formatCurrency(item.unitAmount, selectedInvoice.currency)}</td>
                    <td className="px-4 py-4">
                      {formatCurrency(item.unitAmount * item.quantity, selectedInvoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Reminder
              </p>
              <p className="mt-2 text-sm">{selectedInvoice.reminderSentAt ? formatDate(selectedInvoice.reminderSentAt) : "Not sent"}</p>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Receipt
              </p>
              <p className="mt-2 text-sm">{selectedInvoice.receiptNumber ?? "Pending"}</p>
            </div>
            <div className="rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                Status
              </p>
              <p className="mt-2 text-sm">{STATUS_LABELS[selectedInvoice.status]}</p>
            </div>
          </div>

          <p className="mt-5 rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4 text-sm leading-7 text-[color:var(--muted-foreground)]">
            {selectedInvoice.notes}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReminder}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold"
            >
              <Mail size={14} />
              Send reminder
            </button>
            <button
              type="button"
              onClick={handleStripeSandbox}
              disabled={paymentLoading}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {paymentLoading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
              Start Stripe sandbox flow
            </button>
            <button
              type="button"
              onClick={handleMarkPaid}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              <CheckCircle2 size={14} />
              Mark paid for demo
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-[1.25rem] border border-black/8 bg-[color:var(--background)] p-4 text-sm text-[color:var(--muted-foreground)]">
              {message}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--muted-foreground)]">
            <BellRing size={14} />
            Real payment confirmation still requires live Stripe or PayPal credentials.
          </div>
        </div>
      </div>
    </section>
  );
}
