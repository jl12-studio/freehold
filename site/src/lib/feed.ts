/** "2026-10-20-named-it-freehold" -> "named-it-freehold". Ids without a date prefix pass through. */
export function slugFromId(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * Posts in feed order: newest first, a date tie broken by id descending.
 * Drafts are dropped unless includeDrafts (pages pass import.meta.env.DEV, so
 * drafts show in dev and never ship in a build). Returns a new array.
 */
export function publishedPosts<T extends { id: string; data: { date: Date; draft: boolean } }>(
  entries: T[],
  includeDrafts: boolean,
): T[] {
  return entries
    .filter((entry) => includeDrafts || !entry.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
}
