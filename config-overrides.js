const { InjectManifest } = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

module.exports = function override(config, env) {
  if (env === "production") {
    config.plugins.push(
      new InjectManifest({
        swSrc: "./src/sw.js",
        swDest: "sw.js",
      }),
      new WebpackPwaManifest({
        name: "My PWA App",
        short_name: "PWA App",
        description: "My Progressive Web Application",
        background_color: "#ffffff",
        crossorigin: "use-credentials",
        icons: [
          {
            src: path.resolve("public/logo192.png"),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      })
    );
  }
  return config;
};
