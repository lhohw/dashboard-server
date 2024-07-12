import { join } from "node:path";
import { readdirSync } from "node:fs";
import { markdownPath } from "const/path";
import { compress } from "utils/compress";
import {
  extractFrontmatter,
  extractHeadings,
  extractMetadata,
  type MarkdownMetadata,
} from "utils/markdown/extract";
import { transform, transformAllImage } from "utils/markdown/transform";

export const isReady = (text: string) => {
  const frontmatter = extractFrontmatter(text);
  return frontmatter?.status === "ready";
};

export const getMarkdown = async (category: string, slug: string) => {
  const path = join(markdownPath, category, slug + ".md");
  const file = Bun.file(path);
  const text = await file.text();
  if (!isReady(text)) throw new Error("Post is not on ready state");
  return text;
};

export const serializeMarkdown = async (markdown: string, category: string) => {
  const transformed = transform(markdown, category);
  const imgTransformed = await transformAllImage(transformed);
  const compressed = compress(imgTransformed);
  return compressed;
};

export const serialize = async (category: string, slug: string) => {
  const markdown = await getMarkdown(category, slug);
  const compressed = await serializeMarkdown(markdown, category);
  const headings = extractHeadings(markdown);

  return { compressed, headings };
};

export const fetchAllMarkdownMetadataOnReady = async () => {
  const path = markdownPath;
  const dirs = readdirSync(path).filter(
    (e) => !e.endsWith(".md") && e !== "draft"
  );

  const markdownMetadatas: MarkdownMetadata[] = [];
  for (const category of dirs) {
    const categoryPath = `${markdownPath}/${category}`;
    const files = readdirSync(categoryPath);
    const markdowns = await Promise.all(
      files.map(async (slug) => {
        const text = await getMarkdown(category, slug);
        return extractMetadata(slug, text, category);
      })
    );
    const onReadyMarkdowns = markdowns.filter(
      ({ frontmatter }) => frontmatter.status === "ready"
    );
    markdownMetadatas.push(...onReadyMarkdowns);
  }

  return markdownMetadatas;
};
