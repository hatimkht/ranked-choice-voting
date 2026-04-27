/** @type {import('next').NextConfig} */

// Bei einem Build über GitHub Actions setzen wir die Repo-URL als Basis,
// damit Assets unter /fruit-website/* geladen werden. Lokal (dev/build)
// bleibt die App ohne basePath erreichbar.
const isPagesBuild = process.env.GITHUB_PAGES === "true";
const repoBasePath = isPagesBuild ? "/fruit-website" : "";

const nextConfig = {
  reactStrictMode: true,
  // Static Export für GitHub Pages — erzeugt einen `out/`-Ordner mit reinem HTML.
  output: isPagesBuild ? "export" : undefined,
  basePath: repoBasePath,
  assetPrefix: repoBasePath || undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages serviert keine dynamische Image-Optimierung.
    unoptimized: true,
  },
};

export default nextConfig;
