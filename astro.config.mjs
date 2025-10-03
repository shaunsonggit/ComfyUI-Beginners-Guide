import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://shaunsonggit.github.io",
  base: "/ComfyUI-Beginners-Guide/",
  trailingSlash: "always",
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    mdx()
  ],
  markdown: {
    syntaxHighlight: "prism"
  }
});
