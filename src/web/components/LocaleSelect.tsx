import { useEffect, useRef, useState } from "react";

export type LocaleOption = { code: string; label: string };

type LocaleSelectProps = {
  value: string;
  options: LocaleOption[];
  onChange: (code: string) => void;
  id?: string;
};

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="#21141A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LocaleSelect({ value, options, onChange, id }: LocaleSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.code === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="locale-select" style={{ position: "relative" }}>
      <button
        type="button"
        className="locale-select-trigger"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          height: 56,
          background: "#F0EDE6",
          border: "none",
          padding: "0 20px",
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          letterSpacing: "0.08em",
          color: "#21141A",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={value}
          className="locale-select-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: "4px 0 0",
            padding: 0,
            listStyle: "none",
            background: "#FFFFFF",
            boxShadow: "0 8px 32px rgba(33,20,26,0.12)",
            zIndex: 10,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const active = opt.code === value;
            return (
              <li key={opt.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    border: "none",
                    background: "transparent",
                    textAlign: "left",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.08em",
                    color: active ? "#694153" : "#21141A",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "#F0EDE6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
