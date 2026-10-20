import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import NotFound from '../src/pages/404.astro';
import { site } from '../src/config';

const siteRoot = resolve(import.meta.dirname, '..');
// Built from parts so this file never contains the character or the word itself.
const EM_DASH = '\u2014';
const FORBIDDEN_WORD = ['mani', 'festo'].join('');
const read = (path: string) => readFileSync(join(siteRoot, path), 'utf8');

describe('Cloudflare Pages config', () => {
  it('names the Pages project and the output directory in wrangler.toml', () => {
    const toml = read('wrangler.toml');
    expect(toml).toContain('name = "freeholders-org"');
    expect(toml).toContain('compatibility_date = "2026-10-01"');
    expect(toml).toContain('pages_build_output_dir = "dist"');
  });

  it('serves a CSP that allows only this origin plus Google Analytics, and the companion security headers, on every path', () => {
    const headers = read('public/_headers');
    expect(headers.split('\n')[0]).toBe('/*');
    const csp = headers.match(/^\s+Content-Security-Policy: (.+)$/m)?.[1] ?? '';
    expect(csp.split('; ')).toEqual([
      "default-src 'self'",
      "script-src 'self' https://*.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ]);
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    expect(headers).toContain('Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()');
    expect(headers).toContain('X-Frame-Options: DENY');
  });

  it('has no _redirects file: the www redirect is a Cloudflare dashboard rule, and a file line would silently do nothing', () => {
    expect(existsSync(join(siteRoot, 'public/_redirects'))).toBe(false);
  });

  it('allows all crawlers and points at the sitemap index', () => {
    expect(read('public/robots.txt').trim().split('\n')).toEqual([
      'User-agent: *',
      'Allow: /',
      'Sitemap: https://freeholders.org/sitemap-index.xml',
    ]);
  });
});

describe('the 404 page', () => {
  it('says nothing is here and links to the four parts', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(NotFound, { request: new Request('https://freeholders.org/no-such-page') });
    expect(html).toContain('<title>Not found · Freehold</title>');
    expect(html).toMatch(/<h1[^>]*>\s*Nothing is here\.\s*<\/h1>/);
    const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    for (const [href, label] of [
      ['/', 'Philosophy'],
      ['/standard/', 'Standard'],
      ['/feed/', 'Feed'],
      ['/marketplace/', 'Marketplace'],
    ]) {
      expect(main, `${label} link`).toMatch(new RegExp(`<a[^>]*href="${href}"[^>]*>\\s*${label}\\s*<`));
    }
    expect(main.toLowerCase()).not.toContain(FORBIDDEN_WORD);
    expect(main).not.toContain(EM_DASH);
  });

  it('names no canonical URL and is not indexed, since it is served at every missing path', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(NotFound, { request: new Request('https://freeholders.org/no-such-page') });
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('og:url');
    expect(html).toMatch(/<meta name="robots" content="noindex"\s*\/?>/);
  });
});

describe('the social image', () => {
  it('is 1200 by 630', async () => {
    const meta = await sharp(join(siteRoot, 'public/og.png')).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['png', 1200, 630]);
  });

  it('is painted on the light-scheme paper color', async () => {
    const { data } = await sharp(join(siteRoot, 'public/og.png')).extract({ left: 1190, top: 620, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    expect([...data.subarray(0, 3)]).toEqual([0xf6, 0xf2, 0xe9]);
  });
});

describe('scripts/deploy-static.sh', () => {
  const script = join(siteRoot, 'scripts/deploy-static.sh');

  /** Run the script (via bash, so behavior is checked apart from the exec bit) with fake pnpm and rsync first on PATH; each appends its argv to a log. */
  function run(env: Record<string, string>) {
    const bin = mkdtempSync(join(tmpdir(), 'deploy-static-'));
    const log = join(bin, 'calls.log');
    for (const tool of ['pnpm', 'rsync']) {
      const path = join(bin, tool);
      writeFileSync(path, `#!/bin/sh\necho "${tool} $*" >> "${log}"\n`);
      chmodSync(path, 0o755);
    }
    const result = spawnSync('bash', [script], {
      cwd: siteRoot,
      env: { PATH: `${bin}:/usr/bin:/bin`, ...env },
      encoding: 'utf8',
    });
    const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n') : [];
    return { ...result, calls };
  }

  it('is executable', () => {
    expect(statSync(script).mode & 0o111).not.toBe(0);
  });

  it('prints usage and exits 1 without building when DEPLOY_TARGET is unset', () => {
    const r = run({});
    expect(r.status).toBe(1);
    expect(r.stderr + r.stdout).toMatch(/usage/i);
    expect(r.stderr + r.stdout).toContain('DEPLOY_TARGET');
    expect(r.calls).toEqual([]);
  });

  it('treats an empty DEPLOY_TARGET as unset', () => {
    const r = run({ DEPLOY_TARGET: '' });
    expect(r.status).toBe(1);
    expect(r.calls).toEqual([]);
  });

  it.each(['user@host:', 'user@host:/', 'user@host://', 'user@host:~', 'user@host:~/', '.', './', '..', '/'])(
    'refuses DEPLOY_TARGET=%s (a home, root, or working directory --delete would wipe) without building',
    (target) => {
      const r = run({ DEPLOY_TARGET: target });
      expect(r.status).toBe(1);
      expect(r.stderr).toMatch(/refusing/i);
      expect(r.calls).toEqual([]);
    },
  );

  it('accepts a remote target with a relative site directory', () => {
    const r = run({ DEPLOY_TARGET: 'deploy@example.net:freeholders.org/' });
    expect(r.status).toBe(0);
    expect(r.calls).toEqual(['pnpm build', 'rsync -az --delete dist/ deploy@example.net:freeholders.org/']);
  });

  it('builds, then rsyncs dist/ to the target with --delete', () => {
    const r = run({ DEPLOY_TARGET: 'user@host:/var/www/freeholders.org/' });
    expect(r.status).toBe(0);
    expect(r.calls).toEqual(['pnpm build', 'rsync -az --delete dist/ user@host:/var/www/freeholders.org/']);
  });

  it('explains at the top that _headers is Cloudflare-specific and headers.nginx.conf is its twin', () => {
    const head = readFileSync(script, 'utf8').split('\n').slice(0, 12).join('\n');
    expect(head).toContain('_headers');
    expect(head).toContain('headers.nginx.conf');
    expect(head).not.toContain('_redirects');
    expect(head).toContain('DEPLOY.md');
  });
});

describe('DEPLOY.md', () => {
  const md = read('DEPLOY.md');

  it('has the six runbook sections in order', () => {
    const headings = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(headings).toEqual([
      'What gets deployed',
      'Steady state: Cloudflare Pages from GitHub',
      'Manual: deploy from this machine',
      'Escape hatch: any plain host',
      'Receipts',
      'Checks after a deploy',
    ]);
  });

  it('states the receipts from src/config.ts', () => {
    expect(md).toContain(`$${site.costs.hostingPerMonthUsd} a month`);
    expect(md).toContain(`$${site.costs.domainFirstYearUsd.toFixed(2)}`);
  });

  it('carries the exact commands Marcus will run', () => {
    for (const needle of [
      'jl12-studio/freehold',
      'pnpm dlx wrangler login',
      'pnpm run deploy',
      'DEPLOY_TARGET=user@host:/path ./scripts/deploy-static.sh',
      'include /var/www/freeholders.org/headers.nginx.conf;',
      'curl -sI https://freeholders.org | grep -i content-security-policy',
      '/feed.xml',
      '/registry.json',
    ]) {
      expect(md, needle).toContain(needle);
    }
  });

  it('never uses the forbidden word', () => {
    expect(md.toLowerCase()).not.toContain(FORBIDDEN_WORD);
  });

  it('names page URLs with the trailing slash, since trailingSlash is always and a slashless path redirects', () => {
    const checks = md.slice(md.indexOf('## Checks after a deploy'));
    expect(checks).toContain('https://www.freeholders.org/standard/');
    expect(checks).toContain('https://freeholders.org/standard/');
    // Every freeholders.org URL in the runbook that is a page (no file extension) ends in a slash.
    const pageUrls = [...md.matchAll(/https:\/\/(?:www\.)?freeholders\.org(\/[^\s`"')]*)?/g)]
      .map((m) => m[1] ?? '/')
      .filter((path) => !/\.[a-z0-9]+$/i.test(path) && path !== '/no-such-page');
    expect(pageUrls.length).toBeGreaterThan(0);
    for (const path of pageUrls) expect(path, path).toMatch(/\/$/);
  });
});

describe('analytics', () => {
  it('names the GA4 measurement id in config, and the CSP admits exactly the Google hosts it needs', () => {
    expect(site.analytics.ga4).toMatch(/^G-[A-Z0-9]{6,}$/);
    const csp = read('public/_headers').match(/^\s+Content-Security-Policy: (.+)$/m)?.[1] ?? '';
    const externalHosts = [...csp.matchAll(/https:\/\/[^\s;]+/g)].map((m) => m[0]);
    expect(new Set(externalHosts)).toEqual(
      new Set(['https://*.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com']),
    );
  });

  it('loads the tag only in a production build', () => {
    const layout = read('src/layouts/BaseLayout.astro');
    expect(layout).toContain("import.meta.env.PROD ? site.analytics.ga4 : ''");
    expect(layout).toContain("gtag('config', ga4, { send_page_view: false })");
    expect(layout).toContain("document.addEventListener('astro:page-load'");
  });
});

describe('package.json', () => {
  it('offers an og script that regenerates the image', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts.og).toBe('node scripts/make-og.mjs');
  });
});
