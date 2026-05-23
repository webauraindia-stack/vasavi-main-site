/** Guest houses highlighted on the Health Centre page (wellness / pilgrimage context). */
export const HEALTH_CENTRE_HOTEL_SLUGS = [
  "srisailam-mallikarjuna-retreat",
  "tirumala-venkateswara-stay",
  "vasavi-nityannadana-residency-hyderabad",
  "rajahmundry-vasavi-godavari-sadan",
] as const;

export const HEALTH_CENTRE_QUERY_TYPES = [
  "general",
  "booking",
  "senior",
  "other",
] as const;

export type HealthCentreQueryType = (typeof HEALTH_CENTRE_QUERY_TYPES)[number];
