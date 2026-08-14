export type ApartmentStatus = "available" | "reserved" | "sold" | "unavailable";
export type RoomKey = "studio" | "1" | "2" | "3";

export type ApartmentUnit = {
  id: string;
  n: string;
  f: number;
  c: number;
  k: string;
  r: RoomKey;
  a: number;
  p: number | null;
  m: number | null;
  s: ApartmentStatus;
  v: string;
  h: string;
  t: string;
  g: string | null;
  vr: string;
  hr: string;
  tr: string;
};

export type ApartmentBoard = {
  project: string;
  source: string;
  currency: string;
  floors: number[];
  columns: string[];
  units: ApartmentUnit[];
};

export const STATUS_COLOR: Record<ApartmentStatus, string> = {
  available: "#8CB2C0",
  reserved: "#C4A35A",
  sold: "#c9b8b0",
  unavailable: "#e6ddd4",
};

export const SELECTABLE: ApartmentStatus[] = ["available", "reserved"];
