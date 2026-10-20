import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const DATA_TYPE = /\btype\s*=\s*["']?(?:application\/(?:ld\+)?json|text\/plain)/i;

/** Bodies of the inline, executable scripts in one HTML document, byte for byte. */
export function extractInlineScripts(html: string): string[] {
  const bodies: string[] = [];
  for (const [, attrs, body] of html.matchAll(SCRIPT)) {
    if (/\bsrc\s*=/i.test(attrs) || DATA_TYPE.test(attrs) || body.trim() === '') continue;
    bodies.push(body);
  }
  return bodies;
}

/** The CSP source expression for one inline script body. */
export function scriptSource(body: string): string {
  return `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
}

/** Add the hash of every given inline script to script-src of the Content-Security-Policy in a _headers file. */
export function withScriptHashes(headers: string, bodies: string[]): string {
  if (bodies.length === 0) return headers;
  const hashes = [...new Set(bodies.map(scriptSource))].sort();
  return headers.replace(/^(\s*Content-Security-Policy:\s*)(.+)$/m, (_line, prefix: string, policy: string) => {
    const directives = policy.split('; ');
    const at = directives.findIndex((d) => d === 'script-src' || d.startsWith('script-src '));
    if (at === -1) throw new Error('csp-hashes: the Content-Security-Policy in public/_headers has no script-src directive to extend.');
    directives[at] = [directives[at], ...hashes].join(' ');
    return prefix + directives.join('; ');
  });
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

/**
 * After the build, hash every inline script Astro emitted (the island runtime, for one) and
 * write the hashes into dist/_headers. public/_headers stays the readable `script-src 'self'` source.
 */
export default function cspHashes(): AstroIntegration {
  let publicDir = '';
  return {
    name: 'freehold-csp-hashes',
    hooks: {
      'astro:config:done': ({ config }) => {
        publicDir = fileURLToPath(config.publicDir);
      },
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const bodies = htmlFiles(out).flatMap((file) => extractInlineScripts(readFileSync(file, 'utf8')));
        const template = readFileSync(join(publicDir, '_headers'), 'utf8');
        writeFileSync(join(out, '_headers'), withScriptHashes(template, bodies));
        logger.info(`CSP script-src: ${new Set(bodies).size} inline script hash(es) written to _headers`);
      },
    },
  };
}
