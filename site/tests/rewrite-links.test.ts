import { describe, expect, it } from 'vitest';
import { rewriteHref, rewriteRootLinksPlugin, type UrlNode } from '../src/lib/rewrite-links';

const options = { repoUrl: 'https://github.com/freeholders/freehold', branch: 'main' };
const rewrite = (url: string) => rewriteHref(url, options);

describe('rewriteHref', () => {
  it('sends FRAMEWORK.md to /standard/', () => {
    expect(rewrite('FRAMEWORK.md')).toBe('/standard/');
  });

  it('sends PHILOSOPHY.md to / and keeps a fragment', () => {
    expect(rewrite('PHILOSOPHY.md#the-roadmap')).toBe('/#the-roadmap');
  });

  it('strips a leading ../ first', () => {
    expect(rewrite('../PHILOSOPHY.md')).toBe('/');
  });

  it('sends README.md to the repository readme', () => {
    expect(rewrite('README.md')).toBe('https://github.com/freeholders/freehold#readme');
  });

  it('sends any other Markdown file to its GitHub blob', () => {
    expect(rewrite('raw/x.md')).toBe('https://github.com/freeholders/freehold/blob/main/raw/x.md');
    expect(rewrite('drafts/2026-10-10-reddit-reply.md')).toBe(
      'https://github.com/freeholders/freehold/blob/main/drafts/2026-10-10-reddit-reply.md',
    );
  });

  it('sends a directory link to its GitHub tree', () => {
    expect(rewrite('raw/')).toBe('https://github.com/freeholders/freehold/tree/main/raw/');
  });

  it('leaves absolute URLs alone', () => {
    expect(rewrite('https://example.com/a.md')).toBe('https://example.com/a.md');
  });

  it('leaves same-page anchors and root-relative paths alone', () => {
    expect(rewrite('#anchor')).toBe('#anchor');
    expect(rewrite('/feed/')).toBe('/feed/');
  });
});

describe('rewriteRootLinksPlugin (Sätteri mdast plugin)', () => {
  function run(node: UrlNode) {
    const calls: Array<[UrlNode, string, string]> = [];
    const plugin = rewriteRootLinksPlugin(options);
    plugin.link(node, { setProperty: (n, key, value) => calls.push([n, key, value]) });
    return calls;
  }

  it('has a name and visits links and definitions with the same rule', () => {
    const plugin = rewriteRootLinksPlugin(options);
    expect(plugin.name).toBe('freehold-rewrite-root-links');
    expect(plugin.definition).toBe(plugin.link);
  });

  it('sets url through the context when the href changes', () => {
    const node = { type: 'link', url: 'FRAMEWORK.md' };
    expect(run(node)).toEqual([[node, 'url', '/standard/']]);
  });

  it('touches nothing when the href is already fine', () => {
    expect(run({ type: 'link', url: 'https://example.com/' })).toEqual([]);
  });
});
