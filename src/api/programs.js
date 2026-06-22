export async function fetchPrograms(filters = {}) {
  const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
  const qs = new URLSearchParams(clean).toString();
  const res = await fetch(`/api/programs${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('failed to load programs');
  return res.json();
}
