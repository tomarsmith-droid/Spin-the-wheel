/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
// Must match the repository name exactly — GitHub Pages serves project sites
// at https://<owner>.github.io/<repo>/ and the request path is case-sensitive.
const repo = "Spin-the-wheel";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isPages && {
    output: "export",
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
