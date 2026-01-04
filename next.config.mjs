// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//       },
//     ],
//   },
// };

// export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//       },
//     ],
//   },
//   // Add this headers function:
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Content-Security-Policy",
//             // This relaxes the policy to allow Vercel scripts and eval()
//             value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://clerk.com;"
//           }
//         ]
//       }
//     ];
//   }
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // UPDATED POLICY: Added *.clerk.accounts.dev and *.clerk.com
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://*.clerk.com https://*.clerk.accounts.dev;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;