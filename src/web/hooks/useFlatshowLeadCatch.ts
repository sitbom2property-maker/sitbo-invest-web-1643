import { useEffect, useState } from "react";
import { isFlatshowLeadMessage } from "../lib/flatshow";

export function useFlatshowLeadCatch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (isFlatshowLeadMessage(e.data)) setOpen(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return { open, setOpen };
}
