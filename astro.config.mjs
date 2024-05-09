import { defineConfig } from "astro/config";
import purgecss from "astro-purgecss";
import react from "@astrojs/react";
import rescript from "@jihchi/vite-plugin-rescript";

// https://astro.build/config
export default defineConfig({
  site: "https://tenmileselverdinge.be",
  integrations: [purgecss(), react({ include: /\.(jsx|res.mjs)$/ })],
  vite: {
    plugins: [rescript()],
    server: {
      watch: {
        ignored: ["**/.idea/**"],
      },
    },
  },
});
