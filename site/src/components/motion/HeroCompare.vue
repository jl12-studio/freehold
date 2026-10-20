<script lang="ts">
// Module scope, not component scope: it survives ClientRouter page swaps, so the
// count plays once per visit even if the reader leaves "/" and comes back.
let played = false;
</script>

<script setup lang="ts">
/*
 * Leasehold versus freehold, side by side, in the hero slot of "/".
 *
 * Rendered on the server in its FINAL state ($2,400 after ten years, $0), so with
 * JavaScript off the page reads correctly and hydration changes no layout. In the
 * browser, once motion is allowed, the panels settle in (fade and a short lift) and
 * the leasehold total counts up one, five, ten years. Under reduced motion, or on a
 * return visit, nothing moves: the final state simply stays. Durations, easing and
 * distance are the DESIGN.md "Motion" tokens, via ./count.
 */
import { computed, onMounted, reactive, ref } from 'vue';
import { useMotion, useMotionTransitions } from '@vueuse/motion';
import {
  COUNT_START_YEARS,
  COUNT_STEPS,
  FINAL_YEARS,
  afterLabel,
  leaseholdLabel,
  motionTokens,
  shouldAnimate,
} from './count';

// Same value on the server and in the first client render, so hydration matches.
const counter = reactive({ years: FINAL_YEARS });
const leaseTotal = computed(() => leaseholdLabel(counter.years));
const freeholdAfter = computed(() => afterLabel(counter.years));

const leaseEl = ref<HTMLElement>();
const freeholdEl = ref<HTMLElement>();

const animate =
  typeof window !== 'undefined' &&
  shouldAnimate({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    alreadyPlayed: played,
  });

const { durationMs, easeOut, staggerMs } = motionTokens;
const settle = { duration: durationMs, ease: easeOut };

// The composables are only created when something will move. Their "initial" state
// (transparent, lifted) is applied from script, never from the server-rendered HTML.
const rootFontPx = animate ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;
const liftPx = motionTokens.distanceRem * rootFontPx;
const leaseMotion = animate ? useMotion(leaseEl, { initial: { opacity: 0, y: liftPx } }) : null;
const freeholdMotion = animate ? useMotion(freeholdEl, { initial: { opacity: 0, y: liftPx } }) : null;
const { push } = useMotionTransitions();

function countTo(years: number): Promise<void> {
  return new Promise((resolve) => {
    push('years', years, counter, { type: 'keyframes', ...settle }, resolve);
  });
}

onMounted(async () => {
  if (!animate || !leaseMotion || !freeholdMotion) return;
  played = true;
  counter.years = COUNT_START_YEARS;

  await Promise.all([
    leaseMotion.apply({ opacity: 1, y: 0, transition: settle }),
    freeholdMotion.apply({ opacity: 1, y: 0, transition: { ...settle, delay: staggerMs } }),
  ]);

  for (const years of COUNT_STEPS) await countTo(years);
});
</script>

<template>
  <div
    role="group"
    aria-label="Leasehold compared with freehold over ten years"
    class="grid gap-10 pt-10 md:grid-cols-2 md:gap-0"
  >
    <div ref="leaseEl" role="group" aria-labelledby="compare-leasehold" class="md:pr-10">
      <p id="compare-leasehold" class="font-sans text-h4 font-[650] text-muted">Leasehold</p>
      <p class="mt-3 font-serif text-h2 font-semibold tracking-[-0.01em] text-fg">$20 a month</p>
      <p class="mt-3 font-serif text-h3 text-fg tabular-nums">{{ leaseTotal }}</p>
      <p class="mt-4 max-w-[30rem] font-serif text-body text-muted">
        The landlord keeps the keys. Stop paying, lose the software and the data.
      </p>
    </div>

    <div
      ref="freeholdEl"
      role="group"
      aria-labelledby="compare-freehold"
      class="md:border-l md:border-rule md:pl-10"
    >
      <p id="compare-freehold" class="font-sans text-h4 font-[650] text-muted">Freehold</p>
      <p class="mt-3 font-serif text-h2 font-semibold tracking-[-0.01em] text-accent">$0 a month</p>
      <p class="mt-3 font-serif text-h3 text-fg tabular-nums"><span class="text-accent">$0</span> {{ freeholdAfter }}</p>
      <p class="mt-4 max-w-[30rem] font-serif text-body text-muted">
        You keep the keys. Your data, your deployment, your choice of providers.
      </p>
    </div>
  </div>
</template>
