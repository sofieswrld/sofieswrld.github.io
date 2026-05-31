import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const noteSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
      }),
    )
    .default([]),
  sourceUrl: z.url().optional(),
  draft: z.boolean().default(false),
});

export const collections = {
  posts: defineCollection({
    loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
    schema: postSchema,
  }),
  notes: defineCollection({
    loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
    schema: noteSchema,
  }),
};
