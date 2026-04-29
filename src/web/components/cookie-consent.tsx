import { useState, useEffect } from "react";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  light: "#FFFBF0",
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    performance: false,
    targeting: false,
    functionality: false,
  });

  // Check if user has already made a choice
  useEffect(() => {
    const consent = localStorage.getItem("sitbo_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      performance: true,
      targeting: true,
      functionality: true,
    };
    localStorage.setItem("sitbo_cookie_consent", JSON.stringify(allPreferences));
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    const minimalPreferences = {
      necessary: true,
      performance: false,
      targeting: false,
      functionality: false,
    };
    localStorage.setItem("sitbo_cookie_consent", JSON.stringify(minimalPreferences));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("sitbo_cookie_consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowDetails(false);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "necessary") return; // Necessary is locked
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  if (!showBanner) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px", background: C.dark, borderTop: `1px solid rgba(140,178,192,0.2)` }}>
        {!showDetails ? (
          <>
            {/* Main Banner */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "start" }}>
              <div>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 600, color: C.light, margin: "0 0 12px", letterSpacing: "0.05em" }}>
                  This website uses cookies.
                </h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(255,251,240,0.7)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: "600px" }}>
                  We use cookies to analyze traffic, personalize content, and provide you with a premium browsing experience in the Batumi real estate market. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <button onClick={() => setShowDetails(true)} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.teal, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Show Details
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end", minWidth: "300px" }}>
                <button onClick={handleDeclineAll} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.light, background: "transparent", border: `1px solid rgba(255,251,240,0.3)`, borderRadius: "6px", padding: "11px 24px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,251,240,0.3)")}>
                  Decline All
                </button>
                <button onClick={handleAcceptAll} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "6px", padding: "11px 28px", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Accept All
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Details Panel */}
            <div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 600, color: C.light, margin: "0 0 24px", letterSpacing: "0.05em" }}>
                Cookie Preferences
              </h3>

              {/* Toggles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                {[
                  { key: "necessary", label: "Strictly Necessary", desc: "Required for essential site functionality. Cannot be disabled." },
                  { key: "performance", label: "Performance", desc: "Help us understand how you use the site to improve performance." },
                  { key: "targeting", label: "Targeting", desc: "Used to deliver personalized ads and marketing content." },
                  { key: "functionality", label: "Functionality", desc: "Enable enhanced features and personalization." },
                ].map((cat) => (
                  <div key={cat.key} style={{ background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.1)", borderRadius: "8px", padding: "16px", cursor: cat.key === "necessary" ? "not-allowed" : "pointer", opacity: cat.key === "necessary" ? 1 : 1 }} onClick={() => togglePreference(cat.key as keyof typeof preferences)}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <input
                        type="checkbox"
                        checked={(preferences as any)[cat.key]}
                        disabled={cat.key === "necessary"}
                        onChange={() => togglePreference(cat.key as keyof typeof preferences)}
                        style={{ marginTop: "2px", cursor: cat.key === "necessary" ? "not-allowed" : "pointer", accentColor: C.teal }}
                      />
                      <div>
                        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: C.light, margin: "0 0 4px" }}>
                          {cat.label}
                          {cat.key === "necessary" && <span style={{ fontSize: "0.7rem", color: C.teal, marginLeft: "8px" }}>(Required)</span>}
                        </p>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(255,251,240,0.55)", margin: 0, lineHeight: 1.5 }}>
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Details Buttons */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button onClick={() => setShowDetails(false)} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.light, background: "transparent", border: `1px solid rgba(255,251,240,0.3)`, borderRadius: "6px", padding: "11px 24px", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,251,240,0.3)")}>
                  Back
                </button>
                <button onClick={handleSavePreferences} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "6px", padding: "11px 28px", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Save Preferences
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
