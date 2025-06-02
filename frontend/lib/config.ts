export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  residents: "/residents",
  apartments: "/apartments",
  fees: "/fees",
} as const;
