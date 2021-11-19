/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `https://node.signalclout.com/api/v0/:slug*`,
      },
    ];
  },
};
