import { frontmatterRegex } from "const/regex";

type Status = "draft" | "ready";
export type ParsedMarkdown = {
  frontmatter: Record<string, string> & { status: Status; title: string };
  slug: string;
  category: string;
};
export const extract = (
  filename: string,
  text: string,
  category: string
): ParsedMarkdown => {
  const matched = text.match(frontmatterRegex);
  const slug = filename.replace(/.md$/, "");
  if (!text.startsWith("---") || !matched) {
    return {
      frontmatter: { status: "draft", title: "" },
      slug,
      category,
    };
  }

  const frontmatter = matched[1].split("\n").reduce((acc, item) => {
    const idx = item.indexOf(":");
    const key = item.slice(0, idx).trim();
    item = item.slice(idx + 1).trim();
    return {
      ...acc,
      [key]: item,
    };
  }, {} as Record<string, string>);

  text = text.replace(matched[0], "");
  if (!frontmatter.status || !frontmatter.title) {
    throw new Error(
      `Prepared post ${filename} has no status(${frontmatter.status}) or title(${frontmatter.title})`
    );
  }

  return {
    frontmatter: {
      ...frontmatter,
      status: frontmatter.status as Status,
      title: frontmatter.title,
    },
    slug,
    category,
  };
};
