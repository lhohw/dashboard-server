import type { Heading } from "const/definitions";
import { frontmatterRegex, headingRegex } from "const/regex";

export type MarkdownStatus = "draft" | "ready";
export type MarkdownMetadata = {
  frontmatter: Record<string, string> & { status: MarkdownStatus };
  slug: string;
  category: string;
};

export const extractFrontmatter = (text: string) => {
  const matched = text.match(frontmatterRegex);
  if (!matched) return null;
  const frontmatter = matched[1].split("\n").reduce((acc, item) => {
    const idx = item.indexOf(":");
    const key = item.slice(0, idx).trim();
    item = item.slice(idx + 1).trim();

    return {
      ...acc,
      [key]: item,
    };
  }, {} as Record<string, string>);

  return frontmatter;
};

export const extractHeadings = (markdown: string): Heading[] => {
  const headings = [];
  let matched;
  const regex = new RegExp(headingRegex, "mg");
  while ((matched = regex.exec(markdown))) {
    const [, sharp, textContent] = matched;
    const tagName = `h${sharp.length}`;

    headings.push({
      tagName,
      textContent,
    });
  }

  return headings;
};
