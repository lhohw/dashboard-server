import { readdirSync } from "fs";
import {
  extractFrontmatter,
  type MarkdownMetadata,
} from "utils/markdown/extract";
import { getPostPath } from "utils/path";
import path from "path";

export const readCategories = () => {
  const markdownPath = getPostPath();
  const dirs = readdirSync(markdownPath);
  return dirs.filter((dir) => !dir.endsWith(".md") && dir !== "draft");
};

export const readFileNames = (category: string) => {
  const path = getPostPath(category);
  const fileNames = readdirSync(path);
  return fileNames;
};

export const fetchMarkdown = async (category: string, slug: string) => {
  let p = getPostPath(category, slug);
  let file = Bun.file(p);

  try {
    return await file.text();
  } catch (e: any) {
    if (e.name === "EISDIR") {
      p = path.join(p, "index.md");
      file = Bun.file(p);
      return await file.text();
    } else if (!p.endsWith(".md")) {
      p += ".md";
      file = Bun.file(p);
      return await file.text();
    }

    console.error(`invalid path: ${p}`);
    throw new Error(e);
  }
};

export const fetchAllMarkdownMetadataOnReady = async () => {
  const categories = readCategories();

  const markdownMetadatas: MarkdownMetadata[] = [];

  for (const category of categories) {
    const fileNames = readFileNames(category);

    const markdowns = await Promise.all(
      fileNames.map(async (slug) => {
        const text = await fetchMarkdown(category, slug);
        const frontmatter = extractFrontmatter(text);
        return { category, slug, frontmatter };
      })
    );

    const onReadyMarkdowns = markdowns.filter(
      ({ frontmatter }) => frontmatter?.status === "ready"
    ) as NonNullable<MarkdownMetadata[]>;

    markdownMetadatas.push(...onReadyMarkdowns);
  }

  return markdownMetadatas;
};
