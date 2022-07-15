/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["source.unsplash.com", "res.cloudinary.com"],
  },

  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
};

module.exports = nextConfig;
