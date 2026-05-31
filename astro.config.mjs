import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export default defineConfig({
  site: "https://sofieswrld.blog",
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [
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
