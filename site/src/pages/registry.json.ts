import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config';
import { toRegistryJson } from '../lib/registry';

/** Static file endpoint: built once into dist/registry.json. */
export const GET: APIRoute = async () => {
  const entries = await getCollection('registry');
  const body = JSON.stringify(toRegistryJson(entries, site.url, new Date()), null, 2);
  return new Response(body, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
