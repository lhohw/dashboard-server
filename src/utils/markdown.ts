import { markdownPath } from "const/path";
import { join } from "node:path";
import {
  frontmatterRegex,
  inlineStyleRegex,
  markdownSerializerRegex,
} from "const/regex";
import { compress } from "./compress";

type Status = "draft" | "ready";
export type MarkdownMetadata = {
  frontmatter: Record<string, string> & { status: Status; title: string };
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
    frontmatter: { status: "draft", title: "" },
    slug,
    category,
  };
  if (!text.startsWith("---")) return _default;

  const frontmatter = extractFrontmatter(text);
  if (!frontmatter) return _default;

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

export const serializeMarkdown = async (category: string, slug: string) => {
  const path = join(markdownPath, category, slug + ".md");
  const file = Bun.file(path);
  const text = await file.text();
  const styleToJSX = removeCommentAndReplaceInlineStyleToJSX(text);
  const compressed = compress(styleToJSX);
  return compressed;
};

/** Has 2 responsibility for performance reason */
const removeCommentAndReplaceInlineStyleToJSX = (text: string) => {
  return text.replace(markdownSerializerRegex, (matched) => {
    if (isComment(matched)) return "";
    return inlineStyleToJSX(matched);
  });
};

export const toCamelCase = (text: string) => {
  return text.replace(/-\w/g, (matched) => matched[1].toUpperCase());
};

const isComment = (text: string) => text.startsWith("<!--");

export const inlineStyleToJSX = (text: string) => {
  let json = "";
  let m;
  while ((m = inlineStyleRegex.exec(text))) {
    let [, key, value] = m;
    if (key === undefined || value === undefined) continue;
    key = toCamelCase(key);
    if (isNaN(+value)) value = `'${value}'`;
    json += ` ${key}: ${value},`;
  }
  return `style={{${json} }}`;
};
