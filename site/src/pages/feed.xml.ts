import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config';
import { publishedPosts, slugFromId } from '../lib/feed';

// Always the shipped view: drafts are never in the feed, even under `pnpm dev`.
export async function GET(context: APIContext) {
  const posts = publishedPosts(await getCollection('feed'), false);
  const response = await rss({
    title: 'Freehold Feed',
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/feed/${slugFromId(post.id)}/`,
    })),
  });
  // One <item> per line: same RSS 2.0, but readable in a diff and countable with grep -c.
  const xml = (await response.text()).replaceAll('<item>', '\n<item>').replaceAll('</channel>', '\n</channel>');
  return new Response(xml, { headers: response.headers });
}
