import { useState, useEffect } from "react";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  light: "#FFFBF0",
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

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

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "calc(100vw - 32px)",
        maxWidth: "320px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "rgba(33,20,26,0.92)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,251,240,0.16)",
          borderRadius: "10px",
          padding: "14px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
        }}
      >
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,251,240,0.62)",
            margin: "0 0 8px",
          }}
        >
          Cookie Notice
        </p>
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.78rem",
            color: "rgba(255,251,240,0.84)",
            lineHeight: 1.5,
            margin: "0 0 12px",
          }}
        >
          We use cookies to improve your browsing experience.
        </p>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleDeclineAll}
            style={{
              flex: 1,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.light,
              background: "transparent",
              border: "1px solid rgba(255,251,240,0.25)",
              borderRadius: "8px",
              padding: "8px 10px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.teal)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,251,240,0.25)")}
          >
            Decline
          </button>
          <button
            onClick={handleAcceptAll}
            style={{
              flex: 1,
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.dark,
              background: C.teal,
              border: "1px solid transparent",
              borderRadius: "8px",
              padding: "8px 10px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
