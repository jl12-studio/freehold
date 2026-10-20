export const site = {
  name: 'Freehold',
  domain: 'freeholders.org',
  url: 'https://freeholders.org',
  description: 'Freehold software is software you own outright. The philosophy, the standard, and the registry.',
  repoUrl: 'https://github.com/jl12-studio/freehold',
  repoBranch: 'main',
  costs: { hostingPerMonthUsd: 0, domainFirstYearUsd: 8.5, host: 'Cloudflare Pages' },
  /** Google Analytics 4 measurement id. Loaded only in production builds; empty string disables it. */
  analytics: { ga4: 'G-D0YWCNJCH8' },
} as const;
