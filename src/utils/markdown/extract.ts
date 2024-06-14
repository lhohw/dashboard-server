import type { Heading } from "const/definitions";
import { frontmatterRegex, headingRegex } from "const/regex";

export type MarkdownStatus = "draft" | "ready";
export type MarkdownMetadata = {
  frontmatter: Record<string, string> & { status: MarkdownStatus };
  slug: string;
  category: string;
};
export const extractMetadata = (
  filename: string,
  text: string,
  category: string
): MarkdownMetadata => {
  const slug = filename.replace(/.md$/, "");
  const _default: MarkdownMetadata = {
    frontmatter: { status: "draft" },
    slug,
    category,
  };
  if (!text.startsWith("---")) return _default;

  const frontmatter = extractFrontmatter(text);
  if (!frontmatter) return _default;

  if (!frontmatter.status) {
    throw new Error(
      `Prepared post ${filename} has no status(${frontmatter.status}) or title(${frontmatter.title})`
    );
  }

  return {
    frontmatter: {
      ...frontmatter,
      status: frontmatter.status as MarkdownStatus,
    },
    slug,
    category,
  };
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
  while ((matched = headingRegex.exec(markdown))) {
    const [, sharp, textContent] = matched;
    const tagName = `h${sharp.length}`;

    headings.push({
      tagName,
      textContent,
    });
  }

  return headings;
};
