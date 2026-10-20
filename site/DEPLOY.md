# Deploying freeholders.org

The site is plain static files. Cloudflare Pages is the default host because the domain is already there and the tier is free. Nothing here locks you in: the escape hatch below moves the site to any web server with one command.

## What gets deployed

The output of `pnpm build` in `dist/`. Plain HTML, CSS, a little JavaScript, fonts, and images. Nothing to run on the server: no database, no runtime, no functions.

Two files in `dist/` are Cloudflare Pages conventions and only take effect there:

- `_headers`: the Content-Security-Policy (everything restricted to this origin) and the other security headers.
- `_redirects`: the www-to-apex rule. Pages only honors path-based rules in this file, so the www redirect that actually runs is the Redirect Rule in the Cloudflare dashboard (see below). The file stays as the written record of the intent.

Everything else (`robots.txt`, `sitemap-index.xml`, `404.html`, `og.png`, the feed and the registry) works on any host.

## Steady state: Cloudflare Pages from GitHub

Deploys happen on every push to `main`. Do this once:

1. Push this repository to GitHub as `freeholders/freehold` (public). If you use a different name, update `repoUrl` in `src/config.ts`.
2. In the Cloudflare dashboard open **Workers & Pages**, then **Create**, then the **Pages** tab, then **Connect to Git**.
3. Choose the repository `freeholders/freehold`.
4. Set the build configuration:
   - Project name: `freeholders-org`
   - Production branch: `main`
   - Root directory: `site`
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node version: the build reads `site/.node-version` (24). If it does not pick it up, add the environment variable `NODE_VERSION=24`.
5. Save and deploy. The first build runs right away.

Then add the domains under the project's **Custom domains** tab:

1. Add `freeholders.org`.
2. Add `www.freeholders.org`.

Pages ignores host-based lines in `_redirects` (`wrangler pages dev` prints "Only relative URLs are allowed" for it), so send `www` to the apex with a Redirect Rule instead:

1. In the Cloudflare dashboard open the `freeholders.org` zone, then **Rules**, then **Redirect Rules**, then **Create rule**.
2. When the hostname equals `www.freeholders.org`, redirect with a dynamic expression `concat("https://freeholders.org", http.request.uri.path)`, status 301, and preserve the query string.

Only `freeholders.org` then serves pages.

## Manual: deploy from this machine

Use this until the repository is on GitHub, or any time you want to push without a commit.

```sh
cd site
pnpm dlx wrangler login   # once; opens a browser for Cloudflare
pnpm deploy               # builds, then uploads dist/ to the Pages project
```

The first run creates the Pages project `freeholders-org` if it does not exist. Confirm when prompted. After that, `pnpm deploy` is the whole command.

To preview the headers locally before uploading anything:

```sh
pnpm build
pnpm exec wrangler pages dev dist --port 4481
curl -sI http://127.0.0.1:4481/ | grep -i content-security-policy
```

## Escape hatch: any plain host

Any server that can serve files will do.

```sh
cd site
DEPLOY_TARGET=user@host:/path ./scripts/deploy-static.sh
```

The script requires `DEPLOY_TARGET` (it prints usage and exits 1 without it), runs `pnpm build`, then `rsync -az --delete dist/ "$DEPLOY_TARGET"`. For example: `DEPLOY_TARGET=deploy@example.net:/var/www/freeholders.org/`.

`_headers` and `_redirects` do nothing off Cloudflare, so reproduce the headers and the www redirect in the server config. For nginx:

```nginx
server {
    listen 80;
    server_name www.freeholders.org;
    return 301 https://freeholders.org$request_uri;
}

server {
    listen 443 ssl;
    server_name freeholders.org;
    # ssl_certificate and ssl_certificate_key go here.

    root /var/www/freeholders.org;
    index index.html;
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ $uri.html =404;

        add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
        add_header X-Frame-Options "DENY" always;
    }
}
```

The `script-src` above is the template from `public/_headers`. The build adds a `'sha256-...'` hash for every inline script Astro emits (the island runtime on `/`, for one), so copy the `Content-Security-Policy` line from `dist/_headers` after a build, not from this page, or those scripts are blocked and the islands never hydrate. Re-copy it after any build that changes Astro's runtime.

`add_header` inside a `location` replaces any inherited ones, so keep all five together as above. If you add another `location` block (for caching, say), repeat them there.

## Receipts

At cost, with receipts. Both lines come from `src/config.ts`, and the site footer states them:

- Hosting: $0 a month (Cloudflare Pages free tier).
- Domain: $8.50 the first year.

## Checks after a deploy

```sh
curl -sI https://freeholders.org | grep -i content-security-policy
```

It should print the policy beginning `default-src 'self'`. Then:

1. Open `https://freeholders.org/feed.xml`. It should show the RSS feed.
2. Open `https://freeholders.org/registry.json`. It should show the registry.
3. Open `https://www.freeholders.org/standard`. It should land on `https://freeholders.org/standard`.
4. Open `https://freeholders.org/no-such-page`. It should show "Nothing is here." with a 404 status.
