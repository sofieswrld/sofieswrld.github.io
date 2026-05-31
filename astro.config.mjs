import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeYouTubeEmbeds from "./src/lib/rehype-youtube-embeds";
import remarkYouTubeEmbeds from "./src/lib/remark-youtube-embeds";

export default defineConfig({
  site: "https://sofieswrld.blog",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkYouTubeEmbeds],
      rehypePlugins: [
        rehypeYouTubeEmbeds,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              className: ["heading-anchor"],
              ariaLabel: "이 제목으로 이동",
            },
            test: (node) => {
              const className = node.properties?.className ?? [];
              const classes = Array.isArray(className) ? className : [className];
              return !classes.includes("sr-only");
            },
            content: {
              type: "text",
              value: "#",
            },
          },
        ],
      ],
    }),
  },
});
