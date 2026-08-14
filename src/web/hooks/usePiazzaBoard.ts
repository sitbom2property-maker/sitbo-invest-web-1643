import { useEffect, useState } from "react";
import snapshot from "../data/piazza-apartments.json";
import type { ApartmentBoard } from "../data/apartments";

const FALLBACK = snapshot as ApartmentBoard;

export function usePiazzaBoard() {
  const [board, setBoard] = useState<ApartmentBoard>(FALLBACK);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/apartments/piazza")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: ApartmentBoard) => {
        if (!cancelled && Array.isArray(data?.units) && data.units.length) setBoard(data);
      })
      .catch(() => {
        /* snapshot already loaded */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return board;
}
