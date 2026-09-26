export const WEEKDAY_LABELS = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
] as const;

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export function isBeforeToday(iso: string): boolean {
  return isPastDate(fromISODate(iso));
}

/** Grid of 42 cells (6 weeks) starting on Monday. */
export function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const leadDays = (first.getDay() + 6) % 7; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: leadDays }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function monthLabel(year: number, month: number): string {
  const capitalized = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  })
    .format(new Date(year, month, 1))
    .replace(/^\w/, (c) => c.toUpperCase());
  return capitalized;
}

export function formatLongDate(iso: string): string {
  const capitalized = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(fromISODate(iso))
    .replace(/^\w/, (c) => c.toUpperCase());
  return capitalized;
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(fromISODate(iso));
}