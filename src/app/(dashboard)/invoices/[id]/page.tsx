"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { colors, fonts, gradients } from "@/styles/theme";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { generateInvoicePDF } from "@/lib/generatePDF";

type Invoice = {
  id: string;
  invoice_number: string;
  status: string;
  total: number;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  due_date: string;
  issue_date: string;
  notes: string;
  clients: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gst_number: string;
  };
  invoice_items: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
};

const statusColors: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  paid: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.25)",
  },
  unpaid: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.25)",
  },
  overdue: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.25)",
  },
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
          color: colors.textMuted,
          fontFamily: fonts.body,
        }}
      >
        Loading...
      </div>
    );

  if (!invoice)
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
          color: colors.textMuted,
          fontFamily: fonts.body,
        }}
      >
        Invoice not found
      </div>
    );

  const s = statusColors[invoice.status];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      {/* Invoice Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 32px",
            borderBottom: `1px solid ${colors.borderDefault}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: gradients.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={22} color="#fff" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.textPrimary,
                  margin: "0 0 4px",
                }}
              >
                {invoice.invoice_number}
              </h2>
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  margin: 0,
                  fontFamily: fonts.body,
                }}
              >
                Issued:{" "}
                {invoice.issue_date
                  ? new Date(invoice.issue_date).toLocaleDateString("en-IN")
                  : "—"}
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              background: s?.bg,
              border: `1px solid ${s?.border}`,
              color: s?.color,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: fonts.body,
              textTransform: "capitalize",
            }}
          >
            {invoice.status}
          </div>
        </div>

        {/* Client + Invoice Info */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
        >
          <div
            style={{
              padding: "24px 32px",
              borderRight: `1px solid ${colors.borderDefault}`,
            }}
          >
            <p
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 12px",
                fontFamily: fonts.body,
              }}
            >
              Bill To
            </p>
            <p
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: 600,
                margin: "0 0 4px",
                fontFamily: fonts.body,
              }}
            >
              {invoice.clients?.name}
            </p>
            <p
              style={{
                color: colors.textMuted,
                fontSize: 13,
                margin: "0 0 2px",
                fontFamily: fonts.body,
              }}
            >
              {invoice.clients?.email}
            </p>
            {invoice.clients?.phone && (
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  margin: "0 0 2px",
                  fontFamily: fonts.body,
                }}
              >
                {invoice.clients?.phone}
              </p>
            )}
            {invoice.clients?.address && (
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  margin: "0 0 2px",
                  fontFamily: fonts.body,
                }}
              >
                {invoice.clients?.address}
              </p>
            )}
            {invoice.clients?.gst_number && (
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  margin: 0,
                  fontFamily: fonts.body,
                }}
              >
                GST: {invoice.clients?.gst_number}
              </p>
            )}
          </div>
          <div style={{ padding: "24px 32px" }}>
            <p
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 12px",
                fontFamily: fonts.body,
              }}
            >
              Invoice Info
            </p>
            {[
              {
                label: "Due Date",
                value: invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString("en-IN")
                  : "—",
              },
              { label: "Tax Rate", value: `${invoice.tax_rate}%` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    fontFamily: fonts.body,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: colors.textPrimary,
                    fontSize: 13,
                    fontFamily: fonts.body,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div style={{ padding: "0 32px 24px" }}>
          <div
            style={{
              border: `1px solid ${colors.borderDefault}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr 1fr 1fr",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.04)",
                borderBottom: `1px solid ${colors.borderDefault}`,
              }}
            >
              {["Description", "Qty", "Rate", "Amount"].map((h) => (
                <span
                  key={h}
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontFamily: fonts.body,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {invoice.invoice_items?.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 1fr 1fr 1fr",
                  padding: "14px 16px",
                  borderBottom:
                    i < invoice.invoice_items.length - 1
                      ? `1px solid ${colors.borderDefault}`
                      : "none",
                }}
              >
                <span
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontFamily: fonts.body,
                  }}
                >
                  {item.description}
                </span>
                <span
                  style={{
                    color: colors.textMuted,
                    fontSize: 14,
                    fontFamily: fonts.body,
                  }}
                >
                  {item.quantity}
                </span>
                <span
                  style={{
                    color: colors.textMuted,
                    fontSize: 14,
                    fontFamily: fonts.body,
                  }}
                >
                  ₹{item.rate?.toLocaleString("en-IN")}
                </span>
                <span
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: fonts.body,
                  }}
                >
                  ₹{item.amount?.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div
          style={{
            padding: "0 32px 28px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ width: 280 }}>
            {[
              {
                label: "Subtotal",
                value: `₹${invoice.subtotal?.toLocaleString("en-IN")}`,
              },
              {
                label: `Tax (${invoice.tax_rate}%)`,
                value: `₹${invoice.tax_amount?.toLocaleString("en-IN")}`,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    color: colors.textMuted,
                    fontSize: 14,
                    fontFamily: fonts.body,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    fontFamily: fonts.body,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 12,
                borderTop: `1px solid ${colors.borderDefault}`,
              }}
            >
              <span
                style={{
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: fonts.heading,
                }}
              >
                Total
              </span>
              <span
                style={{
                  color: colors.primary,
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: fonts.heading,
                }}
              >
                ₹{invoice.total?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div
            style={{
              padding: "20px 32px 28px",
              borderTop: `1px solid ${colors.borderDefault}`,
            }}
          >
            <p
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 8px",
                fontFamily: fonts.body,
              }}
            >
              Notes
            </p>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                margin: 0,
                fontFamily: fonts.body,
              }}
            >
              {invoice.notes}
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => router.push("/invoices")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: colors.textMuted,
            fontSize: 14,
            fontFamily: fonts.body,
            padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to Invoices
        </button>

        <button
          onClick={() => generateInvoicePDF(invoice)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 10,
            background: gradients.primary,
            border: "none",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: fonts.body,
            boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
          }}
        >
          <Download size={16} /> Download PDF
        </button>
      </div>
    </div>
  );
}
