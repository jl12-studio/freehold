import { describe, expect, it } from 'vitest';
import { getItLinks, hasGetIt, type RegistryData } from '../src/lib/registry';

const base: RegistryData = {
  name: 'Freehold Ledger',
  oneLine: 'Bookkeeping, by conversation.',
  status: 'building',
  stage: 'desktop',
  maintainer: { name: 'Marcus Salinas' },
  updated: new Date('2026-10-20'),
  standard: [],
};

describe('getItLinks', () => {
  it('lists every link in the fixed order when all fields exist', () => {
    const data: RegistryData = {
      ...base,
      release: 'https://example.com/app.dmg',
      install: 'https://example.com/install',
      checklist: 'https://example.com/checklist',
      guides: { human: 'https://example.com/human', agent: 'https://example.com/agent' },
    };
    expect(getItLinks(data)).toEqual([
      { label: 'Download for Mac', href: 'https://example.com/app.dmg' },
      { label: 'Install steps', href: 'https://example.com/install' },
      { label: "The app's own checklist", href: 'https://example.com/checklist' },
      { label: 'Guide for you', href: 'https://example.com/human' },
      { label: 'Guide for your agent', href: 'https://example.com/agent' },
    ]);
  });

  it('lists only the download when only release exists', () => {
    expect(getItLinks({ ...base, release: 'https://example.com/app.dmg' })).toEqual([
      { label: 'Download for Mac', href: 'https://example.com/app.dmg' },
    ]);
  });

  it('skips a missing guide', () => {
    expect(getItLinks({ ...base, guides: { agent: 'https://example.com/agent' } })).toEqual([
      { label: 'Guide for your agent', href: 'https://example.com/agent' },
    ]);
  });

  it('is empty when no field exists', () => {
    expect(getItLinks(base)).toEqual([]);
  });
});

describe('hasGetIt', () => {
  it('is true with an agentPrompt, install or release', () => {
    expect(hasGetIt({ ...base, agentPrompt: 'Get it.' })).toBe(true);
    expect(hasGetIt({ ...base, install: 'https://example.com/install' })).toBe(true);
    expect(hasGetIt({ ...base, release: 'https://example.com/app.dmg' })).toBe(true);
  });

  it('is false with none of them, even if guides exist', () => {
    expect(hasGetIt(base)).toBe(false);
    expect(hasGetIt({ ...base, guides: { human: 'https://example.com/human' } })).toBe(false);
  });
});

async function renderPage(data: RegistryData): Promise<string> {
  const { experimental_AstroContainer: AstroContainer } = await import('astro/container');
  const { default: Page } = await import('../src/pages/marketplace/[slug].astro');
  const entry = {
    id: 'freehold-ledger',
    data: { ...data, standard: Array.from({ length: 10 }, (_, i) => ({ point: i + 1, status: 'not-yet' as const })) },
  };
  const { getContainerRenderer } = await import('@astrojs/vue');
  const { loadRenderers } = await import('astro:container');
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  return container.renderToString(Page, {
    props: { entry },
    params: { slug: 'freehold-ledger' },
    routeType: 'page',
    request: new Request('https://freeholders.org/marketplace/freehold-ledger/'),
  });
}

describe('the marketplace detail page', () => {
  const prompt = 'Download Freehold Ledger from https://example.com/app.dmg, check it, install it and connect yourself.';

  it('shows "Get it" above the checklist with the sentence, the links and no em dash', async () => {
    const html = await renderPage({ ...base, license: 'MIT', agentPrompt: prompt, release: 'https://example.com/app.dmg' });
    expect(html).toContain('aria-labelledby="get-heading"');
    expect(html.indexOf('get-heading')).toBeLessThan(html.indexOf('checklist-heading'));
    expect(html).toContain('Paste this to your agent. It downloads the app, checks it, installs it and connects itself.');
    expect(html).toContain(prompt);
    expect(html).toContain('href="https://example.com/app.dmg"');
    expect(html).toContain('rel="noopener"');
    expect(html).toContain('<span>MIT</span>');
    expect(html).toMatch(/<button[^>]*type="button"[^>]*hidden/);
    expect(html).toContain('role="status"');
  });

  it('has no "Get it" section when the entry has none of the new fields', async () => {
    const html = await renderPage(base);
    expect(html).not.toContain('Get it');
    expect(html).not.toContain('get-heading');
  });

  it('shows the links without a sentence block when there is no agentPrompt', async () => {
    const html = await renderPage({ ...base, install: 'https://example.com/install' });
    expect(html).toContain('Install steps');
    expect(html).not.toContain('Paste this to your agent');
  });
});
