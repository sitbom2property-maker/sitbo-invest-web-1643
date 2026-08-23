import { useState, type CSSProperties, type FormEvent } from "react";
import { trackLead } from "../lib/analytics";

const labelStyle: CSSProperties = {
  display: "block",
  fontFamily: "Inter, sans-serif",
  fontSize: "0.62rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#FFFEF9",
  marginBottom: "8px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,254,249,0.05)",
  border: "1px solid rgba(140,178,192,0.1)",
  color: "#FFFEF9",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  padding: "14px 16px",
  outline: "none",
  transition: "border-color 0.2s",
  borderRadius: 0,
};

type ConsultationFormProps = {
  onSuccess?: () => void;
  source?: string;
};

export function ConsultationForm({ onSuccess, source = "Consultation" }: ConsultationFormProps) {
  const [form, setForm] = useState({ name: "", contact: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.contact.trim()) {
      setError("Please fill in your name and contact.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (res.ok) {
        trackLead({ source, budget: form.budget });
        setSubmitted(true);
        window.setTimeout(() => onSuccess?.(), 2500);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          color: "#FFFEF9",
          textAlign: "center",
          margin: "24px 0 0",
          lineHeight: 1.6,
        }}
      >
        Thank you. We&apos;ll be in touch within 24 hours.
      </p>
    );
  }

  return (
    <>
      <style>{`
        .consultation-form input::placeholder,
        .consultation-form select { color: #FFFEF9; }
        .consultation-form input::placeholder { color: #FFFEF9; }
        .consultation-form select option { background: #21141A; color: #FFFEF9; }
        .consultation-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 768px) {
          .consultation-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <form className="consultation-form" onSubmit={handleSubmit}>
        <div className="consultation-form-row" style={{ marginBottom: "16px" }}>
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#703C54")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(140,178,192,0.1)")}
            />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp / Phone *</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#703C54")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(140,178,192,0.1)")}
            />
          </div>
        </div>

        <div style={{ marginBottom: "0" }}>
          <label style={labelStyle}>Investment Budget</label>
          <select
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            style={{ ...inputStyle, cursor: "pointer" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#703C54")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(140,178,192,0.1)")}
          >
            <option value="">Select your budget range</option>
            <option value="50-100k">$50,000 – $100,000</option>
            <option value="100-200k">$100,000 – $200,000</option>
            <option value="200-500k">$200,000 – $500,000</option>
            <option value="500k+">$500,000+</option>
          </select>
        </div>

        {error && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#FFFEF9", margin: "16px 0 0" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "rgba(112,60,84,0.6)" : "#703C54",
            color: "#FFFEF9",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "16px",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            marginTop: "24px",
            transition: "background 0.25s",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "#FFFEF9";
              btn.style.color = "#21141A";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "#703C54";
              btn.style.color = "#FFFEF9";
            }
          }}
        >
          {loading ? "Sending..." : "Request Private Consultation"}
        </button>
      </form>
    </>
  );
}
