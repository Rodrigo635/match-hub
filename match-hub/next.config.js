// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "82.112.245.100",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "82.112.245.100",
        port: "8080",
        pathname: "/avatar/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
            {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/avatar/**",
      },
    ],
  },
};
