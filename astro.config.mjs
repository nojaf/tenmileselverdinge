import { defineConfig } from "astro/config";
import purgecss from "astro-purgecss";
import react from "@astrojs/react";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://tenmileselverdinge.be",
  integrations: [purgecss(), react(), icon()],
  vite: {
    server: {
      watch: {
        ignored: ["**/.idea/**"],
      },
    },
  },
});
