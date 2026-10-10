import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /professor virou apenas um redirecionamento para o English Quest v3.
  async redirects() {
    return [
      {
        source: "/professor",
        destination: "https://english-quest-v3-siesparty.vercel.app/professor",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
