import { useEffect, useState } from "react";
import piazzaSnapshot from "../data/piazza-apartments.json";
import parklineSnapshot from "../data/parkline-apartments.json";
import type { ApartmentBoard } from "../data/apartments";

export type ApartmentProjectKey = "piazza" | "parkline";

const FALLBACK: Record<ApartmentProjectKey, ApartmentBoard> = {
  piazza: piazzaSnapshot as ApartmentBoard,
  parkline: parklineSnapshot as ApartmentBoard,
};

export function useApartmentBoard(key: ApartmentProjectKey) {
  const [board, setBoard] = useState<ApartmentBoard>(FALLBACK[key]);

  useEffect(() => {
    let cancelled = false;
    setBoard(FALLBACK[key]);
    fetch(`/api/apartments/${key}`)
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
  }, [key]);

  return board;
}
