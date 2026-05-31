export const SITE = {
  name: "Sofie’s Wrld",
  title: "Sofie’s Wrld",
  description: "소피의 세계, 글, 조각글을 모아두는 작은 개인 공간.",
  url: "https://sofieswrld.blog",
  locale: "ko_KR",
} as const;

export type NavItem = {
  href: string;
  label: string;
  match: "exact" | "prefix";
};

export const NAV_ITEMS = [
  { href: "/", label: "소피의세계", match: "exact" },
  { href: "/posts", label: "글", match: "prefix" },
  { href: "/notes", label: "조각글", match: "prefix" },
] satisfies NavItem[];

export const normalizePathname = (pathname: string) =>
  pathname.replace(/\/$/, "") || "/";

export const isNavItemActive = (item: NavItem, pathname: string) => {
  const currentPath = normalizePathname(pathname);

  if (item.match === "exact") return currentPath === item.href;
  return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
};
