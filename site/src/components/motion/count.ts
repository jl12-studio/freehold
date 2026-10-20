/*
 * Pure helpers for the hero comparison (HeroCompare.vue). No DOM, no Vue: the
 * component asks these for text and timing, and tests/motion.test.ts pins them.
 * Motion values mirror site/DESIGN.md "Motion" and the tokens in global.css.
 */

/** What the subscription costs, per month, in dollars. */
export const MONTHLY_PRICE = 20;

/** The count runs from one year, through five, to ten (the server-rendered final state). */
export const COUNT_START_YEARS = 1;
export const COUNT_STEPS = [5, 10] as const;
export const FINAL_YEARS = COUNT_STEPS[COUNT_STEPS.length - 1];

/** Mirrors --motion-slow, --motion-distance, --ease-out and the 60ms stagger rule in DESIGN.md. */
export const motionTokens = {
  durationMs: 480,
  distanceRem: 0.75,
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  staggerMs: 60,
};

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Mid-tween values arrive fractional; show a whole year between one and ten. */
function wholeYears(years: number): number {
  return Math.min(FINAL_YEARS, Math.max(COUNT_START_YEARS, Math.round(years)));
}

/** Total paid after this many years of a $20 monthly subscription. */
export function leaseholdTotal(years: number): number {
  return MONTHLY_PRICE * 12 * wholeYears(years);
}

/** "after one year", "after five years". */
export function afterLabel(years: number): string {
  const whole = wholeYears(years);
  return `after ${WORDS[whole]} ${whole === 1 ? 'year' : 'years'}`;
}

/** "$240 after one year", "$2,400 after ten years". One string so it renders as one text node. */
export function leaseholdLabel(years: number): string {
  return `$${leaseholdTotal(years).toLocaleString('en-US')} ${afterLabel(years)}`;
}

/** The island counts only when motion is allowed and it has not already played this session. */
export function shouldAnimate(state: { reducedMotion: boolean; alreadyPlayed: boolean }): boolean {
  return !state.reducedMotion && !state.alreadyPlayed;
}
