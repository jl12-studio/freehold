<script setup lang="ts">
/*
 * The Copy button under the "Get it" sentence (DESIGN.md, "Get it").
 *
 * An island, not an inline script, so the CSP stays `script-src 'self'` with no new
 * hash. The server renders the button `hidden`: with JavaScript off the sentence is
 * still there to select and no dead button shows. On mount the button appears.
 * A copy confirms itself twice, "Copied" on the button for two seconds and a polite
 * live region; if the clipboard is unavailable or refuses, the sentence is selected
 * and the live region asks for Ctrl or Cmd C. Nothing throws.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{ text: string; targetId: string }>();

const ready = ref(false);
const copied = ref(false);
const message = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  ready.value = true;
});
onBeforeUnmount(() => clearTimeout(timer));

function selectSentence() {
  const el = document.getElementById(props.targetId);
  const selection = window.getSelection();
  if (!el || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  selection.removeAllRanges();
  selection.addRange(range);
}

async function copy() {
  clearTimeout(timer);
  try {
    if (!navigator.clipboard) throw new Error('no clipboard');
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    message.value = 'Copied to clipboard';
    timer = setTimeout(() => {
      copied.value = false;
      message.value = '';
    }, 2000);
  } catch {
    copied.value = false;
    selectSentence();
    message.value = 'Press Ctrl or Cmd C to copy';
  }
}
</script>

<template>
  <div class="mt-4">
    <button
      type="button"
      :hidden="!ready"
      class="min-h-11 min-w-[8.5rem] rounded-[var(--radius-md)] border border-rule px-4 py-2 font-sans text-ui text-fg transition-colors duration-[var(--motion-fast)] hover:border-muted"
      @click="copy"
    >
      {{ copied ? 'Copied' : 'Copy' }}
    </button>
    <span role="status" aria-live="polite" class="sr-only">{{ message }}</span>
    <span v-if="message && !copied" class="ml-3 font-sans text-caption text-muted" aria-hidden="true">{{ message }}</span>
  </div>
</template>
