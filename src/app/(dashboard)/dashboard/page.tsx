"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { colors, fonts } from "@/styles/theme";
import { FileText, Users, TrendingUp, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

type ChartData = { month: string; revenue: number }

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    overdueInvoices: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [invoicesRes, clientsRes] = await Promise.all([
        supabase.from("invoices").select("status, total, created_at").eq("user_id", user.id),
        supabase.from("clients").select("id").eq("user_id", user.id),
      ]);

      const invoices = invoicesRes.data ?? [];
      const clients = clientsRes.data ?? [];

      // Stats
      setStats({
        totalInvoices: invoices.length,
        paidInvoices: invoices.filter((i) => i.status === "paid").length,
        unpaidInvoices: invoices.filter((i) => i.status === "unpaid").length,
        overdueInvoices: invoices.filter((i) => i.status === "overdue").length,
        totalClients: clients.length,
        totalRevenue: invoices
          .filter((i) => i.status === "paid")
          .reduce((sum, i) => sum + (i.total ?? 0), 0),
      });

      // Chart — last 6 months ka real data
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const now = new Date()
      const last6: ChartData[] = []

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const month = monthNames[d.getMonth()]
        const year = d.getFullYear()
        const monthStr = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`

        const revenue = invoices
          .filter(inv =>
            inv.status === 'paid' &&
            inv.created_at?.startsWith(monthStr)
          )
          .reduce((sum, inv) => sum + (inv.total ?? 0), 0)

        last6.push({ month, revenue })
      }

      setChartData(last6)
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: colors.primary,
      subtle: colors.primarySubtle,
      border: colors.primaryBorder,
    },
    {
      label: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      color: "#63b3ed",
      subtle: "rgba(99,179,237,0.12)",
      border: "rgba(99,179,237,0.25)",
    },
    {
      label: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: colors.success,
      subtle: colors.successSubtle,
      border: "rgba(52,211,153,0.25)",
    },
    {
      label: "Overdue",
      value: stats.overdueInvoices,
      icon: Clock,
      color: colors.error,
      subtle: colors.errorSubtle,
      border: colors.errorBorder,
    },
  ];

  return (
    <div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');`}</style>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(220px, 1fr))",
        gap: isMobile ? 12 : 16,
        marginBottom: 28,
      }}>
        {statCards.map(({ label, value, icon: Icon, color, subtle, border }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 16,
            padding: isMobile ? "14px 16px" : "20px 24px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: isMobile ? 38 : 46, height: isMobile ? 38 : 46,
              background: subtle, border: `1px solid ${border}`,
              borderRadius: 12, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              <Icon size={isMobile ? 18 : 22} color={color} />
            </div>
            <div>
              <p style={{ color: colors.textMuted, fontSize: isMobile ? 11 : 12, margin: "0 0 4px", fontFamily: fonts.body }}>
                {label}
              </p>
              <p style={{ color: colors.textPrimary, fontSize: isMobile ? 16 : 22, fontWeight: 800, margin: 0, fontFamily: fonts.heading }}>
                {loading ? "..." : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Invoice Status */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>

        {/* Chart */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 16, padding: "24px",
        }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: "0 0 20px" }}>
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke={colors.textMuted}
                tick={{ fontSize: 12, fontFamily: fonts.body }}
                axisLine={false} tickLine={false} />
              <YAxis stroke={colors.textMuted}
                tick={{ fontSize: 12, fontFamily: fonts.body }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => v === 0 ? '₹0' : `₹${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "#1e1b2e", border: `1px solid ${colors.borderDefault}`, borderRadius: 10, fontFamily: fonts.body }}
                labelStyle={{ color: colors.textPrimary }}
                formatter={(v: unknown) => [`₹${(v as number).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke={colors.primary} strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: 16, padding: "24px",
        }}>
          <h3 style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: "0 0 20px" }}>
            Invoice Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Paid", value: stats.paidInvoices, color: colors.success },
              { label: "Unpaid", value: stats.unpaidInvoices, color: colors.warning },
              { label: "Overdue", value: stats.overdueInvoices, color: colors.error },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: colors.textSecondary, fontSize: 13, fontFamily: fonts.body }}>{label}</span>
                  <span style={{ color: colors.textPrimary, fontSize: 13, fontWeight: 600, fontFamily: fonts.body }}>
                    {loading ? "..." : value}
                  </span>
                </div>
                <div style={{ height: 6, background: colors.borderDefault, borderRadius: 99 }}>
                  <div style={{
                    height: "100%",
                    width: stats.totalInvoices > 0 ? `${(value / stats.totalInvoices) * 100}%` : "0%",
                    background: color, borderRadius: 99, transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${colors.borderDefault}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: colors.textMuted, fontSize: 11, margin: "0 0 4px", fontFamily: fonts.body, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Paid Rate
                </p>
                <p style={{ color: colors.success, fontSize: 18, fontWeight: 800, margin: 0, fontFamily: fonts.heading }}>
                  {stats.totalInvoices > 0 ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100) : 0}%
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: colors.textMuted, fontSize: 11, margin: "0 0 4px", fontFamily: fonts.body, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  This Month
                </p>
                <p style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 800, margin: 0, fontFamily: fonts.heading }}>
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}