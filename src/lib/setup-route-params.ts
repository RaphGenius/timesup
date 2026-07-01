export function parseRouteIndex(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const index = Number(raw);

  if (!Number.isInteger(index) || index < 0) {
    return null;
  }

  return index;
}
