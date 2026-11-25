import { describe, expect, it } from 'vitest';
import { collections } from '../src/content.config';

// The registry collection schema, as Astro validates each YAML entry at build time.
const schema = collections.registry.schema as unknown as { safeParse: (v: unknown) => { success: boolean; data?: Record<string, unknown> } };

function entry(overrides: Record<string, unknown> = {}, standard = Array.from({ length: 10 }, (_, i) => ({ point: i + 1, status: 'pass' }))) {
  return {
    name: 'Example',
    oneLine: 'An example.',
    status: 'building',
    stage: 'desktop',
    maintainer: { name: 'Pat Example', url: 'https://example.net' },
    updated: '2026-10-20',
    standard,
    ...overrides,
  };
}

describe('registry collection schema', () => {
  it('accepts a well-formed entry with https links', () => {
    expect(schema.safeParse(entry({ repo: 'https://github.com/example/app', homepage: 'http://example.net' })).success).toBe(true);
  });

  it.each([
    ['repo', { repo: 'javascript:alert(1)' }],
    ['homepage', { homepage: 'data:text/html,<script>alert(1)</script>' }],
    ['maintainer.url', { maintainer: { name: 'Pat', url: 'javascript:alert(1)' } }],
    ['install', { install: 'javascript:alert(1)' }],
    ['checklist', { checklist: 'data:text/html,<script>alert(1)</script>' }],
    ['release', { release: 'javascript:alert(1)' }],
    ['guides.human', { guides: { human: 'javascript:alert(1)' } }],
    ['guides.agent', { guides: { agent: 'data:text/plain,hello' } }],
  ])('rejects a non-web URL in %s', (_field, overrides) => {
    expect(schema.safeParse(entry(overrides)).success).toBe(false);
  });

  it('rejects a non-web evidence URL', () => {
    const standard = Array.from({ length: 10 }, (_, i) => ({ point: i + 1, status: 'pass', evidence: i === 0 ? 'javascript:alert(1)' : undefined }));
    expect(schema.safeParse(entry({}, standard)).success).toBe(false);
  });

  it('rejects a checklist that repeats a point and skips another', () => {
    const standard = Array.from({ length: 10 }, (_, i) => ({ point: i === 3 ? 3 : i + 1, status: 'pass' }));
    expect(schema.safeParse(entry({}, standard)).success).toBe(false);
  });

  it('accepts an entry with every new field', () => {
    const result = schema.safeParse(
      entry({
        install: 'https://example.net/install.md',
        checklist: 'https://example.net/checklist.md',
        release: 'https://example.net/releases',
        guides: { human: 'https://example.net/h.md', agent: 'https://example.net/a.md' },
        license: 'AGPL-3.0-or-later',
        agentPrompt: 'Install Example from https://example.net/install.md.',
      }),
    );
    expect(result.success).toBe(true);
  });

  it('accepts guides with only agent', () => {
    const result = schema.safeParse(entry({ guides: { agent: 'https://example.net/a.md' } }));
    expect(result.success).toBe(true);
    expect(result.data?.guides).toEqual({ agent: 'https://example.net/a.md' });
  });

  it('rejects an agentPrompt over 300 characters and accepts exactly 300', () => {
    expect(schema.safeParse(entry({ agentPrompt: 'a'.repeat(301) })).success).toBe(false);
    expect(schema.safeParse(entry({ agentPrompt: 'a'.repeat(300) })).success).toBe(true);
  });

  it('rejects a license over 60 characters', () => {
    expect(schema.safeParse(entry({ license: 'a'.repeat(61) })).success).toBe(false);
  });

  it('still accepts an entry with none of the new fields', () => {
    expect(schema.safeParse(entry()).success).toBe(true);
  });
});
