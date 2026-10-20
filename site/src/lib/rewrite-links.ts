/*
 * Remark plugin: rewrites the relative Markdown links that PHILOSOPHY.md and
 * FRAMEWORK.md use for GitHub so they work on the website.
 *
 *   PHILOSOPHY.md  -> /
 *   FRAMEWORK.md   -> /standard
 *   README.md      -> <repoUrl>#readme
 *   other *.md     -> <repoUrl>/blob/<branch>/<path>
 *   directory/     -> <repoUrl>/tree/<branch>/<path>
 *
 * Only relative hrefs are touched. Anything with a scheme, or starting with
 * "/" or "#", is left alone. A "#fragment" is kept.
 */

export interface RewriteOptions {
  repoUrl: string;
  branch: string;
}

interface MdNode {
  type: string;
  url?: string;
  children?: MdNode[];
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function rewriteHref(href: string, { repoUrl, branch }: RewriteOptions): string {
  if (href === '' || href.startsWith('/') || href.startsWith('#') || href.startsWith('//') || SCHEME.test(href)) {
    return href;
  }

  const hashAt = href.indexOf('#');
  const rawPath = hashAt === -1 ? href : href.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : href.slice(hashAt);
  const path = rawPath.replace(/^(?:\.{1,2}\/)+/, '');

  if (path === 'PHILOSOPHY.md') return `/${fragment}`;
  if (path === 'FRAMEWORK.md') return `/standard${fragment}`;
  if (path === 'README.md') return `${repoUrl}#readme`;
  if (path.endsWith('.md')) return `${repoUrl}/blob/${branch}/${path}${fragment}`;
  if (path.endsWith('/')) return `${repoUrl}/tree/${branch}/${path}${fragment}`;
  return href;
}

function walk(node: MdNode, options: RewriteOptions): void {
  if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
    node.url = rewriteHref(node.url, options);
  }
  node.children?.forEach((child) => walk(child, options));
}

export function rewriteRootLinks(options: RewriteOptions) {
  return (tree: unknown): void => {
    walk(tree as MdNode, options);
  };
}
