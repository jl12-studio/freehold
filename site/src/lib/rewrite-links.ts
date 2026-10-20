/*
 * Rewrites the relative Markdown links that PHILOSOPHY.md and FRAMEWORK.md use
 * for GitHub so they work on the website.
 *
 *   PHILOSOPHY.md  -> /
 *   FRAMEWORK.md   -> /standard/
 *   README.md      -> <repoUrl>#readme
 *   other *.md     -> <repoUrl>/blob/<branch>/<path>
 *   directory/     -> <repoUrl>/tree/<branch>/<path>
 *
 * Only relative hrefs are touched. Anything with a scheme, or starting with
 * "/" or "#", is left alone. A "#fragment" is kept.
 *
 * rewriteHref is the pure rule. rewriteRootLinksPlugin wraps it as a Sätteri
 * mdast plugin for astro.config.mjs (Astro 7's default Markdown processor).
 */

export interface RewriteOptions {
  repoUrl: string;
  branch: string;
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function rewriteHref(href: string, { repoUrl, branch }: RewriteOptions): string {
  if (href === '' || href.startsWith('/') || href.startsWith('#') || href.startsWith('//') || SCHEME.test(href)) {
    return href;
  }

  const hashAt = href.indexOf('#');
  const rawPath = hashAt === -1 ? href : href.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : href.slice(hashAt);
  const path = rawPath.replace(/^(?:\.{1,2}\/)+/, '');

  if (path === 'PHILOSOPHY.md') return `/${fragment}`;
  if (path === 'FRAMEWORK.md') return `/standard/${fragment}`;
  if (path === 'README.md') return `${repoUrl}#readme`;
  if (path.endsWith('.md')) return `${repoUrl}/blob/${branch}/${path}${fragment}`;
  if (path.endsWith('/')) return `${repoUrl}/tree/${branch}/${path}${fragment}`;
  return href;
}

/** The slice of a Sätteri link or definition node this plugin reads. */
export interface UrlNode {
  readonly type: string;
  readonly url: string;
}

/** The slice of Sätteri's MdastVisitorContext this plugin uses. */
export interface UrlNodeContext {
  setProperty(node: UrlNode, key: 'url', value: string): void;
}

/** A Sätteri mdast plugin: pass it in `satteri({ mdastPlugins: [...] })`. */
export function rewriteRootLinksPlugin(options: RewriteOptions) {
  const visit = (node: UrlNode, ctx: UrlNodeContext): void => {
    const url = rewriteHref(node.url, options);
    if (url !== node.url) ctx.setProperty(node, 'url', url);
  };
  return { name: 'freehold-rewrite-root-links', link: visit, definition: visit };
}
