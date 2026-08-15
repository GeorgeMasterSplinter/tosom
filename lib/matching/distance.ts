// lib/matching/distance.ts — Avstandsberegning (B1.4)
// Radius som dealbreaker: beregner storfeinsavstand i km mellom to punkter.

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * haversineKm — storfeinsavstand i km mellom to lat/lon-punkter.
 *
 * Presisjon ~0,3 % (tilstrekkelig for radius-blokkering paa 1-300 km).
 * Samme punkt -> 0.
 */
export function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number
): number {
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
}
