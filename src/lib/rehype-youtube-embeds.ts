import type { Element, Root, RootContent, Text } from "hast";
import { visit } from "unist-util-visit";

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})(?:[?&][^\s]*)?$/;

const getYouTubeId = (value: string) => {
  const match = value.trim().match(YOUTUBE_URL_PATTERN);
  return match?.[1];
};

const getStandaloneLinkUrl = (node: Element) => {
  if (node.tagName !== "p" || node.children.length !== 1) return;

  const child = node.children[0];
  if (child.type !== "element" || child.tagName !== "a") return;
  if (typeof child.properties.href !== "string") return;

  const text = child.children[0] as Text | undefined;
  if (text?.type !== "text") return;
  if (text.value.trim() !== child.properties.href.trim()) return;

  return child.properties.href;
};

const createYouTubeFigure = (id: string): Element => {
  const title = `YouTube video ${id}`;

  return {
    type: "element",
    tagName: "figure",
    properties: { className: ["youtube-embed"] },
    children: [
      {
        type: "element",
        tagName: "lite-youtube",
        properties: {
          videoid: id,
          title,
          playlabel: `Play: ${title}`,
          params: "rel=0",
        },
        children: [],
      },
    ],
  };
};

export default function rehypeYouTubeEmbeds() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;

      const url = getStandaloneLinkUrl(node);
      const id = url ? getYouTubeId(url) : undefined;
      if (!id) return;

      parent.children.splice(index, 1, createYouTubeFigure(id) as RootContent);
    });
  };
}
