import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  COUNT_STEPS,
  COUNT_START_YEARS,
  FINAL_YEARS,
  afterLabel,
  leaseholdLabel,
  leaseholdTotal,
  motionTokens,
  shouldAnimate,
} from '../src/components/motion/count';

const siteRoot = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(siteRoot, path), 'utf8');

describe('hero comparison: the leasehold running total', () => {
  it('pays $20 a month, so a year is $240', () => {
    expect(leaseholdTotal(1)).toBe(240);
    expect(leaseholdTotal(5)).toBe(1200);
    expect(leaseholdTotal(10)).toBe(2400);
  });

  it('reads as the three named states from the contract', () => {
    expect(leaseholdLabel(1)).toBe('$240 after one year');
    expect(leaseholdLabel(5)).toBe('$1,200 after five years');
    expect(leaseholdLabel(10)).toBe('$2,400 after ten years');
  });

  it('rounds a mid-count tween value to a whole year and stays inside one to ten', () => {
    expect(leaseholdLabel(2.4)).toBe('$480 after two years');
    expect(leaseholdLabel(2.6)).toBe('$720 after three years');
    expect(leaseholdLabel(0)).toBe('$240 after one year');
    expect(leaseholdLabel(11)).toBe('$2,400 after ten years');
  });

  it('gives the freehold side the same timeframe wording, so the totals stay comparable', () => {
    expect(afterLabel(1)).toBe('after one year');
    expect(afterLabel(10)).toBe('after ten years');
  });
});

describe('hero comparison: the count-up plan', () => {
  it('starts at one year and ends on the final state the page server-renders', () => {
    expect(COUNT_START_YEARS).toBe(1);
    expect(FINAL_YEARS).toBe(10);
    expect(COUNT_STEPS.at(-1)).toBe(FINAL_YEARS);
    expect([...COUNT_STEPS]).toEqual([5, 10]);
  });

  it('counts only when motion is allowed and it has not already played this session', () => {
    expect(shouldAnimate({ reducedMotion: false, alreadyPlayed: false })).toBe(true);
    expect(shouldAnimate({ reducedMotion: true, alreadyPlayed: false })).toBe(false);
    expect(shouldAnimate({ reducedMotion: false, alreadyPlayed: true })).toBe(false);
  });
});

describe('motion tokens mirror site/DESIGN.md and global.css', () => {
  const css = read('src/styles/global.css');

  it('uses the slow duration, the distance, and the ease-out curve from the design tokens', () => {
    expect(css).toContain(`--motion-slow: ${motionTokens.durationMs}ms;`);
    expect(css).toContain(`--motion-distance: ${motionTokens.distanceRem}rem;`);
    expect(css).toContain(`--ease-out: cubic-bezier(${motionTokens.easeOut.join(', ')});`);
  });

  it('never exceeds the DESIGN.md limits: nothing slower than 480ms, a 12px lift, 60ms stagger', () => {
    expect(motionTokens.durationMs).toBeLessThanOrEqual(480);
    expect(motionTokens.distanceRem).toBeLessThanOrEqual(0.75);
    expect(motionTokens.staggerMs).toBeLessThanOrEqual(60);
  });
});

describe('.reveal utility (motion.css)', () => {
  it('is imported once from global.css', () => {
    const imports = read('src/styles/global.css').match(/@import\s+["']\.\/motion\.css["'];/g) ?? [];
    expect(imports).toHaveLength(1);
  });

  it('hides nothing unless the browser supports view timelines and motion is allowed', () => {
    const css = read('src/styles/motion.css').replace(/\/\*[\s\S]*?\*\//g, '');
    const supports = css.indexOf('@supports (animation-timeline: view())');
    const noPreference = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    const reveal = css.indexOf('.reveal');
    const timeline = css.indexOf('animation-timeline: view()', reveal);
    expect(supports).toBeGreaterThanOrEqual(0);
    expect(noPreference).toBeGreaterThan(supports);
    expect(reveal).toBeGreaterThan(noPreference);
    expect(timeline).toBeGreaterThan(reveal);
    // Nothing before the guards: no class rule, no keyframes, no opacity in the static CSS.
    const beforeGuards = css.slice(0, supports);
    expect(beforeGuards).not.toMatch(/opacity|\.reveal|@keyframes/);
  });

  it('animates only opacity and transform', () => {
    const css = read('src/styles/motion.css');
    const keyframes = css.match(/@keyframes[^{]+\{([\s\S]*?\}\s*)\}/)?.[1] ?? '';
    const props = [...keyframes.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    expect(props.length).toBeGreaterThan(0);
    for (const prop of props) expect(['opacity', 'transform']).toContain(prop);
  });
});
