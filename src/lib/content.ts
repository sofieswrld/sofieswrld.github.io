import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;
export type NoteEntry = CollectionEntry<"notes">;

export type PostStaticPath = {
  params: { slug: string };
  props: {
    post: PostEntry;
    olderPost?: PostEntry;
    newerPost?: PostEntry;
  };
};

export const getPublishedPosts = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
};

export const getPostStaticPaths = async (): Promise<PostStaticPath[]> => {
  const posts = await getPublishedPosts();

  return posts.map((post, index) => ({
    params: { slug: post.id },
    props: {
      post,
      olderPost: posts[index + 1],
      newerPost: posts[index - 1],
    },
  }));
};

export const getPublishedNotes = async () => {
  const notes = await getCollection("notes", ({ data }) => !data.draft);

  return notes.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
};

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
