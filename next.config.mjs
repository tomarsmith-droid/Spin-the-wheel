/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "spin-the-wheel";

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
