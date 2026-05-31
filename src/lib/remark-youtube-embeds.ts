import type { Root, RootContent } from "mdast";
import { visit } from "unist-util-visit";

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})(?:[?&][^\s]*)?$/;

const getYouTubeId = (value: string) => {
  const match = value.trim().match(YOUTUBE_URL_PATTERN);
  return match?.[1];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export default function remarkYouTubeEmbeds() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;
      if (node.children.length !== 1) return;

      const child = node.children[0];
      const value =
        child.type === "text" || child.type === "link"
          ? child.type === "text"
            ? child.value
            : child.url
          : "";
      const id = getYouTubeId(value);

      if (!id) return;

      const title = `YouTube video ${id}`;
      const htmlNode = {
        type: "html",
        value: `<figure class="youtube-embed"><lite-youtube videoid="${id}" title="${escapeHtml(title)}" playlabel="Play: ${escapeHtml(title)}" params="rel=0"></lite-youtube></figure>`,
      } satisfies RootContent;

      parent.children.splice(index, 1, htmlNode);
    });
  };
}
