import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import cspHashes, { extractInlineScripts, scriptSource, withScriptHashes } from '../src/integrations/csp-hashes';

const sha = (body: string) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
const POLICY = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'";
const HEADERS = `/*\n  Content-Security-Policy: ${POLICY}\n  X-Frame-Options: DENY\n`;

describe('extractInlineScripts', () => {
  it('returns the exact body of each inline script, in order', () => {
    const html = '<head><script>var a = 1;</script><script type="module">import "x";</script></head>';
    expect(extractInlineScripts(html)).toEqual(['var a = 1;', 'import "x";']);
  });

  it('skips scripts that load a file, which script-src self already allows', () => {
    expect(extractInlineScripts('<script type="module" src="/_astro/a.js"></script>')).toEqual([]);
  });

  it('skips data blocks that are never executed', () => {
    expect(extractInlineScripts('<script type="application/ld+json">{"a":1}</script>')).toEqual([]);
  });

  it('keeps whitespace and newlines exactly, because the browser hashes the raw text', () => {
    expect(extractInlineScripts('<script>\n  x();\n</script>')).toEqual(['\n  x();\n']);
  });
});

describe('scriptSource', () => {
  it('is the CSP sha256 source for the raw body', () => {
    expect(scriptSource('alert(1)')).toBe(sha('alert(1)'));
    expect(scriptSource('alert(1)')).toMatch(/^'sha256-[A-Za-z0-9+/]+=*'$/);
  });
});

describe('withScriptHashes', () => {
  it('appends the hashes to script-src and leaves every other directive alone', () => {
    const out = withScriptHashes(HEADERS, ['a();', 'b();']);
    const csp = out.match(/Content-Security-Policy: (.+)$/m)![1].split('; ');
    expect(csp).toEqual([
      "default-src 'self'",
      `script-src 'self' ${[sha('a();'), sha('b();')].sort().join(' ')}`,
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
    ]);
    expect(out).toContain('X-Frame-Options: DENY');
  });

  it('lists a repeated script once', () => {
    const out = withScriptHashes(HEADERS, ['a();', 'a();']);
    expect(out.match(/'sha256-/g)).toHaveLength(1);
  });

  it('is unchanged when no page has an inline script', () => {
    expect(withScriptHashes(HEADERS, [])).toBe(HEADERS);
  });

  it('never opens script-src to unsafe-inline', () => {
    expect(withScriptHashes(HEADERS, ['a();'])).not.toMatch(/script-src[^;]*unsafe-inline/);
  });

  it('fails loudly when the policy has no script-src to extend', () => {
    expect(() => withScriptHashes('/*\n  Content-Security-Policy: default-src \'self\'\n', ['a();'])).toThrow(/script-src/);
  });
});

describe('the astro:build:done hook', () => {
  it('writes dist/_headers from the public/_headers template plus the hashes of every built page', async () => {
    const root = mkdtempSync(join(tmpdir(), 'csp-hashes-'));
    const pub = join(root, 'public');
    const dist = join(root, 'dist');
    mkdirSync(pub);
    mkdirSync(join(dist, 'feed'), { recursive: true });
    writeFileSync(join(pub, '_headers'), HEADERS);
    writeFileSync(join(dist, '_headers'), HEADERS);
    writeFileSync(join(dist, 'index.html'), '<script>one();</script>');
    writeFileSync(join(dist, 'feed', 'index.html'), '<script>two();</script><script>one();</script>');

    const integration = cspHashes();
    const hooks = integration.hooks as Record<string, (o: unknown) => Promise<void> | void>;
    await hooks['astro:config:done']({ config: { publicDir: pathToFileURL(pub + '/') } });
    await hooks['astro:build:done']({ dir: pathToFileURL(dist + '/'), logger: { info() {}, warn() {} } });

    const written = readFileSync(join(dist, '_headers'), 'utf8');
    expect(written).toContain(`script-src 'self' ${[sha('one();'), sha('two();')].sort().join(' ')};`);
    expect(readFileSync(join(pub, '_headers'), 'utf8')).toBe(HEADERS);
  });
});

describe('the marketplace detail meta line (F2)', () => {
  it('spaces the maintainer and the updated date from the label and from the middle dot', async () => {
    const { experimental_AstroContainer: AstroContainer } = await import('astro/container');
    const { default: Page } = await import('../src/pages/marketplace/[slug].astro');
    const entry = {
      id: 'freehold-ledger',
      data: {
        name: 'Freehold Ledger',
        oneLine: 'Bookkeeping, by conversation.',
        status: 'planned',
        stage: 'desktop',
        maintainer: { name: 'Marcus Salinas', url: 'https://jippylong12.xyz' },
        updated: new Date('2026-10-20'),
        standard: Array.from({ length: 10 }, (_, i) => ({ point: i + 1, status: 'not-yet' })),
      },
    };
    const html = await (await AstroContainer.create()).renderToString(Page, {
      props: { entry },
      params: { slug: 'freehold-ledger' },
      routeType: 'page',
      request: new Request('https://freeholders.org/marketplace/freehold-ledger/'),
    });
    const line = html.match(/<p[^>]*>\s*Maintainer:[\s\S]*?<\/p>/)?.[0] ?? '';
    const text = line.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    expect(text).toMatch(/^Maintainer: \S.* · Updated \d{1,2} \w+ \d{4}$/);
  });
});
