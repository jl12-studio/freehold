import { describe, expect, it } from 'vitest';
import { rewriteRootLinks } from '../src/lib/rewrite-links';

const options = { repoUrl: 'https://github.com/freeholders/freehold', branch: 'main' };

type Node = { type: string; url?: string; children?: Node[] };

/** Run the plugin over a minimal mdast tree holding one link, and return the link's url. */
function rewrite(url: string): string {
  const link: Node = { type: 'link', url, children: [{ type: 'text' }] };
  const tree: Node = { type: 'root', children: [{ type: 'paragraph', children: [link] }] };
  rewriteRootLinks(options)(tree as never);
  return link.url as string;
}

describe('rewriteRootLinks', () => {
  it('sends FRAMEWORK.md to /standard', () => {
    expect(rewrite('FRAMEWORK.md')).toBe('/standard');
  });

  it('sends PHILOSOPHY.md#the-roadmap to /#the-roadmap, keeping the fragment', () => {
    expect(rewrite('PHILOSOPHY.md#the-roadmap')).toBe('/#the-roadmap');
  });

  it('strips a leading ../ and sends ../PHILOSOPHY.md to /', () => {
    expect(rewrite('../PHILOSOPHY.md')).toBe('/');
  });

  it('strips a leading ./', () => {
    expect(rewrite('./FRAMEWORK.md')).toBe('/standard');
  });

  it('sends README.md to the repo readme', () => {
    expect(rewrite('README.md')).toBe('https://github.com/freeholders/freehold#readme');
  });

  it('sends any other .md path to the blob URL on the branch', () => {
    expect(rewrite('raw/x.md')).toBe('https://github.com/freeholders/freehold/blob/main/raw/x.md');
    expect(rewrite('raw/2026-07-29-founding-thoughts-verbatim.md')).toBe(
      'https://github.com/freeholders/freehold/blob/main/raw/2026-07-29-founding-thoughts-verbatim.md',
    );
  });

  it('sends a repo directory link (ends in /) to the tree URL on the branch', () => {
    expect(rewrite('raw/')).toBe('https://github.com/freeholders/freehold/tree/main/raw/');
    expect(rewrite('../drafts/')).toBe('https://github.com/freeholders/freehold/tree/main/drafts/');
  });

  it('leaves an absolute URL with a scheme unchanged', () => {
    expect(rewrite('https://example.com/a.md')).toBe('https://example.com/a.md');
  });

  it('leaves a same-page #anchor unchanged', () => {
    expect(rewrite('#anchor')).toBe('#anchor');
  });

  it('leaves a root-relative path unchanged', () => {
    expect(rewrite('/standard')).toBe('/standard');
  });

  it('rewrites links nested deep in the tree', () => {
    const link: Node = { type: 'link', url: 'FRAMEWORK.md' };
    const tree: Node = {
      type: 'root',
      children: [{ type: 'list', children: [{ type: 'listItem', children: [{ type: 'paragraph', children: [link] }] }] }],
    };
    rewriteRootLinks(options)(tree as never);
    expect(link.url).toBe('/standard');
  });
});
