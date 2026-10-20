import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// U+2014, written as an escape so this file never contains the character itself.
const EM_DASH = '—';
const siteRoot = resolve(import.meta.dirname, '..');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function filesToScan(): string[] {
  const srcFiles = walk(join(siteRoot, 'src'));
  const rootMarkdown = readdirSync(siteRoot)
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(siteRoot, name))
    .filter((path) => statSync(path).isFile());
  return [...srcFiles, ...rootMarkdown];
}

function findEmDashes(files: string[]): string[] {
  const hits: string[] = [];
  for (const file of files) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (line.includes(EM_DASH)) {
          hits.push(`${relative(siteRoot, file)}:${index + 1}`);
        }
      });
  }
  return hits;
}

describe('house rule: no em dashes', () => {
  it('finds no U+2014 in src/ or in the *.md files directly in site/', () => {
    expect(findEmDashes(filesToScan()), 'em dash found at file:line').toEqual([]);
  });
});
