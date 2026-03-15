"use client";

import { useEffect, useState } from "react";
import { colors, fonts, gradients } from "@/styles/theme";
import { Plus, Search, Edit2, Trash2, Mail, Phone, Building } from "lucide-react";
import { Client } from "@/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", gst_number: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError("Name and email required"); return; }
    setSaving(true);
    setError("");
    const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients";
    const method = editingClient ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchClients();
      setShowForm(false);
      setEditingClient(null);
      setForm({ name: "", email: "", phone: "", address: "", gst_number: "" });
    }
    setSaving(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone ?? "",
      address: client.address ?? "",
      gst_number: client.gst_number ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    await fetchClients();
  };

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${colors.borderDefault}`,
    borderRadius: "10px",
    padding: "11px 14px",
    color: colors.textPrimary,
    fontSize: "14px",
    fontFamily: fonts.body,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        input::placeholder { color: rgba(241,245,249,0.3) !important; }
        input:focus { border-color: rgba(249,115,22,0.6) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1) !important; }
        .client-card:hover { background: rgba(255,255,255,0.07) !important; }
        .action-btn:hover { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p style={{ color: colors.textMuted, fontSize: 14, margin: 0, fontFamily: fonts.body }}>
          {clients.length} total clients
        </p>
        <button
          onClick={() => { setShowForm(true); setEditingClient(null); setForm({ name: "", email: "", phone: "", address: "", gst_number: "" }); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: isMobile ? "10px 14px" : "10px 18px",
            borderRadius: 10, background: gradients.primary, color: "#fff",
            border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
            fontFamily: fonts.body, boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
          }}>
          <Plus size={16} /> {!isMobile && 'Add Client'}
        </button>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: 10, padding: "10px 14px", marginBottom: 20,
      }}>
        <Search size={16} color={colors.textMuted} />
        <input
          style={{ background: "none", border: "none", outline: "none", color: colors.textPrimary, fontSize: 14, fontFamily: fonts.body, width: "100%" }}
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Client List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: colors.textMuted, fontFamily: fonts.body }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <p style={{ color: colors.textMuted, fontFamily: fonts.body, fontSize: 15 }}>
            {search ? "No clients found" : "No clients yet — add your first client!"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((client) => (
            <div key={client.id} className="client-card" style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${colors.borderDefault}`,
              borderRadius: 14, padding: isMobile ? "14px 16px" : "18px 20px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                {/* Avatar */}
                <div style={{
                  width: 40, height: 40,
                  background: colors.primarySubtle,
                  border: `1px solid ${colors.primaryBorder}`,
                  borderRadius: 12, display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: fonts.heading,
                  fontSize: 16, fontWeight: 800, color: colors.primary, flexShrink: 0,
                }}>
                  {client.name.slice(0, 1).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ color: colors.textPrimary, fontSize: 14, fontWeight: 600, margin: "0 0 3px", fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {client.name}
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: colors.textMuted, fontSize: 12, fontFamily: fonts.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Mail size={11} /> {client.email}
                    </span>
                    {client.phone && !isMobile && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: colors.textMuted, fontSize: 12, fontFamily: fonts.body }}>
                        <Phone size={11} /> {client.phone}
                      </span>
                    )}
                    {client.gst_number && !isMobile && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: colors.textMuted, fontSize: 12, fontFamily: fonts.body }}>
                        <Building size={11} /> {client.gst_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                <button className="action-btn" onClick={() => handleEdit(client)} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(99,179,237,0.1)", border: "1px solid rgba(99,179,237,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <Edit2 size={14} color="#63b3ed" />
                </button>
                <button className="action-btn" onClick={() => handleDelete(client.id)} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  <Trash2 size={14} color={colors.error} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div style={{
            background: "#1a1f2e", border: `1px solid ${colors.borderDefault}`,
            borderRadius: 20, padding: isMobile ? 20 : 32,
            width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto",
          }}>
            <h2 style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, color: colors.textPrimary, margin: "0 0 24px", letterSpacing: "-0.3px" }}>
              {editingClient ? "Edit Client" : "Add New Client"}
            </h2>

            {error && (
              <div style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ color: colors.error, fontSize: 13, margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Full Name *", key: "name", placeholder: "Rahul Sharma", type: "text" },
                { label: "Email *", key: "email", placeholder: "rahul@example.com", type: "email" },
                { label: "Phone", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
                { label: "Address", key: "address", placeholder: "Mumbai, Maharashtra", type: "text" },
                { label: "GST Number", key: "gst_number", placeholder: "27AAPFU0939F1ZV", type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ display: "block", color: colors.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: 7, fontFamily: fonts.body }}>{label}</label>
                  <input
                    style={inputStyle} type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => { setShowForm(false); setEditingClient(null); }} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "rgba(255,255,255,0.05)", border: `1px solid ${colors.borderDefault}`,
                color: colors.textSecondary, fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: fonts.body,
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={saving} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: gradients.primary, border: "none",
                color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: fonts.body,
                boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
                opacity: saving ? 0.6 : 1,
              }}>
                {saving ? "Saving..." : editingClient ? "Update Client" : "Add Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}