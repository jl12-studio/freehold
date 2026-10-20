/*
 * The ten points of the Freehold Standard, by number and title.
 *
 * This is the one deliberate duplication of FRAMEWORK.md Part 1 (the bold leads of
 * the numbered list). Keep it in step with FRAMEWORK.md: if a title changes there,
 * change it here. tests/registry.test.ts pins these titles.
 */
export const STANDARD_POINTS: ReadonlyArray<{ point: number; title: string }> = [
  { point: 1, title: 'Free, and owned by the person' },
  { point: 2, title: 'Deployable anywhere' },
  { point: 3, title: 'Speaks MCP natively' },
  { point: 4, title: 'Hub-and-spoke sync, self-managed' },
  { point: 5, title: 'A declared conflict story' },
  { point: 6, title: 'Agent-operable administration' },
  { point: 7, title: 'Secure by default' },
  { point: 8, title: 'Self-carrying upgrades' },
  { point: 9, title: 'Usable by conversation' },
  { point: 10, title: 'Teaches while it works' },
];
