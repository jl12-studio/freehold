/*
 * Reads the "## Log" section of PHILOSOPHY.md. Entries look like
 *   - **2026-10-20**: ...
 *   - **2026-07-30 (second capture)**: ...
 * and the latest date drives the hero's "Working document, updated ..." line.
 */

const LOG_HEADING = /^##[ \t]+Log[ \t]*$/m;
const NEXT_H2 = /^##[ \t]/m;
const ENTRY_DATE = /^[-*][ \t]+\*\*(\d{4}-\d{2}-\d{2})\b/gm;

export function latestLogDate(markdown: string): string | null {
  const heading = LOG_HEADING.exec(markdown);
  if (!heading) return null;

  let section = markdown.slice(heading.index + heading[0].length);
  const next = NEXT_H2.exec(section);
  if (next) section = section.slice(0, next.index);

  let latest: string | null = null;
  for (const match of section.matchAll(ENTRY_DATE)) {
    if (latest === null || match[1] > latest) latest = match[1];
  }
  return latest;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "2026-10-20" -> "20 October 2026". Fixed English day-month-year order, never the runtime locale. */
export function formatLogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
