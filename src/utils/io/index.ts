import { readdirSync } from "fs";
import {
  extractFrontmatter,
  type MarkdownMetadata,
} from "utils/markdown/extract";
import { getPath } from "utils/path";

export const readCategories = () => {
  const markdownPath = getPath("markdown");
  const dirs = readdirSync(markdownPath);
  return dirs.filter((dir) => !dir.endsWith(".md") && dir !== "draft");
};

export const getFileNames = (category: string) => {
  const path = getPath("markdown", category);
  const fileNames = readdirSync(path);
  return fileNames;
};

export const getMarkdown = async (category: string, slug: string) => {
  const path = getPath("markdown", category, slug);
  const file = Bun.file(path);
  const text = await file.text();
  return text;
};

export const fetchAllMarkdownMetadataOnReady = async () => {
  const categories = readCategories();

  const markdownMetadatas: MarkdownMetadata[] = [];

  for (const category of categories) {
    const fileNames = getFileNames(category);

    const markdowns = await Promise.all(
      fileNames.map(async (slug) => {
        const text = await getMarkdown(category, slug);
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
