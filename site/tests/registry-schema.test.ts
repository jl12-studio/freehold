import { describe, expect, it } from 'vitest';
import { collections } from '../src/content.config';

// The registry collection schema, as Astro validates each YAML entry at build time.
const schema = collections.registry.schema as unknown as { safeParse: (v: unknown) => { success: boolean } };

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
});
