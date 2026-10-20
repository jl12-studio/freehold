import { describe, expect, it } from 'vitest';
import { passCount, toRegistryJson, type RegistryData, type RegistryEntry } from '../src/lib/registry';
import { STANDARD_POINTS } from '../src/lib/standard';

describe('STANDARD_POINTS', () => {
  it('has ten entries numbered 1 to 10 with the titles from FRAMEWORK.md Part 1', () => {
    expect(STANDARD_POINTS.map((p) => p.point)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(STANDARD_POINTS.map((p) => p.title)).toEqual([
      'Free, and owned by the person',
      'Deployable anywhere',
      'Speaks MCP natively',
      'Hub-and-spoke sync, self-managed',
      'A declared conflict story',
      'Agent-operable administration',
      'Secure by default',
      'Self-carrying upgrades',
      'Usable by conversation',
      'Teaches while it works',
    ]);
  });
});

type Status = 'pass' | 'not-yet' | 'n/a';

function data(name: string, statuses: Status[], overrides: Partial<RegistryData> = {}): RegistryData {
  return {
    name,
    oneLine: `${name}, in one line.`,
    status: 'building',
    stage: 'desktop',
    maintainer: { name: 'Pat Example' },
    updated: new Date('2026-10-20T00:00:00.000Z'),
    standard: statuses.map((status, i) => ({ point: i + 1, status })),
    ...overrides,
  };
}

function entry(slug: string, d: RegistryData): RegistryEntry {
  return { id: slug, data: d };
}

const fixture: Status[] = [
  'pass', 'pass', 'pass',
  'not-yet', 'not-yet', 'not-yet', 'not-yet', 'not-yet',
  'n/a', 'n/a',
];

describe('passCount', () => {
  it('counts 3 pass, 5 not yet, 2 n/a in a ten-row fixture', () => {
    expect(passCount(data('Fixture', fixture))).toEqual({ pass: 3, notYet: 5, na: 2 });
  });

  it('accepts a collection entry as well as its data', () => {
    expect(passCount(entry('fixture', data('Fixture', fixture)))).toEqual({ pass: 3, notYet: 5, na: 2 });
  });
});

describe('toRegistryJson', () => {
  const generated = new Date('2026-10-21T12:34:56.000Z');
  const siteUrl = 'https://freeholders.org';

  it('has the v1 envelope', () => {
    const json = toRegistryJson([], siteUrl, generated);
    expect(json.schema).toBe('https://freeholders.org/registry.json#v1');
    expect(json.standard).toBe('https://freeholders.org/standard');
    expect(json.generated).toBe('2026-10-21T12:34:56.000Z');
    expect(json.entries).toEqual([]);
  });

  it('sorts entries by name, regardless of input order', () => {
    const json = toRegistryJson(
      [entry('zeta', data('Zeta', fixture)), entry('alpha', data('Alpha', fixture)), entry('mid', data('Mid', fixture))],
      siteUrl,
      generated,
    );
    expect(json.entries.map((e) => e.slug)).toEqual(['alpha', 'mid', 'zeta']);
  });

  it('shapes an entry with slug, url, updated as YYYY-MM-DD, and titles joined from STANDARD_POINTS', () => {
    const d = data('Freehold Ledger', fixture, {
      status: 'planned',
      repo: 'https://github.com/example/ledger',
      homepage: 'https://example.org',
      maintainer: { name: 'Marcus Salinas', url: 'https://jippylong12.xyz' },
    });
    d.standard[0] = { point: 1, status: 'pass', evidence: 'https://example.org/license', note: 'MIT.' };
    const [e] = toRegistryJson([entry('freehold-ledger', d)], siteUrl, generated).entries;
    expect(e.slug).toBe('freehold-ledger');
    expect(e.name).toBe('Freehold Ledger');
    expect(e.oneLine).toBe('Freehold Ledger, in one line.');
    expect(e.status).toBe('planned');
    expect(e.stage).toBe('desktop');
    expect(e.repo).toBe('https://github.com/example/ledger');
    expect(e.homepage).toBe('https://example.org');
    expect(e.maintainer).toEqual({ name: 'Marcus Salinas', url: 'https://jippylong12.xyz' });
    expect(e.updated).toBe('2026-10-20');
    expect(e.url).toBe('https://freeholders.org/marketplace/freehold-ledger/');
    expect(e.standard).toHaveLength(10);
    expect(e.standard[0]).toEqual({
      point: 1,
      title: 'Free, and owned by the person',
      status: 'pass',
      evidence: 'https://example.org/license',
      note: 'MIT.',
    });
    expect(e.standard[9]).toEqual({ point: 10, title: 'Teaches while it works', status: 'n/a' });
    expect(Object.keys(e.standard[9])).not.toContain('evidence');
  });

  it('omits repo and homepage when absent', () => {
    const [e] = toRegistryJson([entry('a', data('A', fixture))], siteUrl, generated).entries;
    expect('repo' in e).toBe(false);
    expect('homepage' in e).toBe(false);
  });
});
