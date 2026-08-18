import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  experimental: {
    useTypeScriptCli: false,
  },
  async redirects() {
    return [
      {
        source: "/contato.html",
        destination: "/contato",
        permanent: true,
      },
      {
        source: "/projetos/:slug.html",
        destination: "/projetos/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
