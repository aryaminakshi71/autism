/**
 * Sitemap generation utility
 * Generates XML sitemap for search engines
 */

import { blogPosts } from "./marketing-content";

export interface SitemapRoute {
  path: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  lastmod?: string;
}

export function generateSitemap(
  routes: SitemapRoute[],
  baseUrl: string,
): string {
  const urlset = routes
    .map((route) => {
      const url = new URL(route.path, baseUrl).toString();
      const lastmod = route.lastmod || new Date().toISOString().split("T")[0];
      const changefreq = route.changefreq || "weekly";
      const priority = route.priority ?? 0.8;

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

/**
 * Get public routes for SpectrumAI
 */
export function getAutismRoutes(): SitemapRoute[] {
  const staticRoutes: SitemapRoute[] = [
    { path: "/", changefreq: "daily", priority: 1.0 },
    { path: "/pricing", changefreq: "weekly", priority: 0.95 },
    { path: "/blog", changefreq: "weekly", priority: 0.9 },
    { path: "/login", changefreq: "monthly", priority: 0.5 },
    { path: "/register", changefreq: "monthly", priority: 0.7 },
    { path: "/about", changefreq: "monthly", priority: 0.7 },
    { path: "/contact", changefreq: "monthly", priority: 0.7 },
    { path: "/demo", changefreq: "weekly", priority: 0.8 },
    { path: "/docs", changefreq: "weekly", priority: 0.7 },
    { path: "/support", changefreq: "weekly", priority: 0.7 },
    { path: "/privacy", changefreq: "yearly", priority: 0.3 },
    { path: "/terms", changefreq: "yearly", priority: 0.3 },
  ];

  const blogRoutes: SitemapRoute[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: "monthly",
    priority: 0.8,
    lastmod: post.updatedAt || post.publishedAt,
  }));

  return [...staticRoutes, ...blogRoutes];
}
