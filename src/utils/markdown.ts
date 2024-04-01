import { markdownPath } from "const/path";
import { join } from "node:path";
import {
  frontmatterRegex,
  inlineStyleRegex,
  markdownSerializerRegex,
  referenceRowRegex,
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
  const transformed = transform(text);
  const compressed = compress(transformed);
  return compressed;
};

/**
 * Mulitple responsibility for performance reason
 * remove comment | inline style to JSX | transform reference
 * */
const transform = (text: string) => {
  return text.replace(markdownSerializerRegex, (matched) => {
    if (isComment(matched)) return "";
    if (isStyle(matched)) return inlineStyleToJSX(matched);
    if (isReference(matched)) return transformReference(matched);
    throw new Error(`serialization failed\n${matched}`);
  });
};

export const toCamelCase = (text: string) => {
  return text.replace(/-\w/g, (matched) => matched[1].toUpperCase());
};

const isComment = (text: string) => text.startsWith("<!--");
const isStyle = (text: string) => text.startsWith("style");
const isReference = (text: string) => text.startsWith("## 참고");

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

export const transformReference = (text: string) => {
  const hasNewLine = text.endsWith("\n");
  const splitted = text.split("\n");
  const heading = splitted.shift();
  return (
    heading +
    "\n" +
    splitted
      .map((row) => {
        if (row.startsWith("- [")) return row;
        const url = row.substring(1).trim();
        return `- [${url}](${url})`;
      })
      .join("\n") +
    (hasNewLine ? "\n" : "")
  );
};
