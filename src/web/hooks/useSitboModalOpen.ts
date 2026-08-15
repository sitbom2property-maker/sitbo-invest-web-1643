import { useEffect, useState } from "react";

const CLASS = "sitbo-modal-open";

export function useSitboModalOpen() {
  const [open, setOpen] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains(CLASS),
  );

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setOpen(el.classList.contains(CLASS));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return open;
}
