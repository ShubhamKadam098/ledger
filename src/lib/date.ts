export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthRange(monthKey: string) {
  const start = new Date(monthKey + "-01");
  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  return { start, end };
}
