import { markdownPath } from "const/path";
import { join } from "node:path";
import {
  frontmatterRegex,
  inlineStyleRegex,
  markdownSerializerRegex,
  srcRegex,
} from "const/regex";
import { compress } from "./compress";
import { toBase64 } from "./serialize";

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
  const imgTransformed = await transformAllImage(transformed);
  const compressed = compress(imgTransformed);
  return compressed;
};

/**
 * Mulitple responsibility for performance reason
 * remove comment | inline style to JSX | transform reference
 * */
export const transform = (text: string) => {
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
const isReference = (text: string) => text.startsWith("## 참조");

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
  const splitted = text.split(/\n\s*/).filter((e) => !!e.trim());
  const heading = splitted.shift();
  return (
    heading +
    "\n" +
    splitted
      .map((row) => {
        row = row.trim();
        if (row.startsWith("- [")) return row;
        const url = row.substring(1).trim();
        return `- [${url}](${url})`;
      })
      .join("\n") +
    (hasNewLine ? "\n" : "")
  );
};

export const transformAllImage = async (text: string): Promise<string> => {
  try {
    text = await transformImage(text);
    return transformAllImage(text);
  } catch (e) {
    return text;
  }
};

export const transformImage = async (text: string) => {
  const matched = text.match(srcRegex);
  if (!matched) throw new Error("source not matched");

  const [matchedStr, src, ext] = matched;
  const splitted = src.split("/");
  const filename = splitted.pop()!;
  const img = Bun.file(`${process.cwd()}/assets/images/${filename}.${ext}`);
  const buf = await img.arrayBuffer();
  const base64 = toBase64(buf);
  return text.replace(matchedStr, `src="data:image/${ext};base64,${base64}"`);
};
