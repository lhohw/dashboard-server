import { compress } from "utils/compress";
import { extractHeadings } from "utils/markdown/extract";
import { transform, transformAllImage } from "utils/markdown/transform";
import { fetchMarkdown } from "utils/io";

export const serializeMarkdown = async (
  markdown: string,
  category: string,
  slug: string,
  isUploaded?: boolean
) => {
  const transformed = transform(markdown, category);
  const imgTransformed = await transformAllImage(
    transformed,
    category,
    slug,
    isUploaded
  );
  const compressed = compress(imgTransformed);
  return compressed;
};

export const serialize = async (
  category: string,
  slug: string,
  isUploaded?: boolean
) => {
  const markdown = await fetchMarkdown(category, slug);
  const compressed = await serializeMarkdown(
    markdown,
    category,
    slug,
    isUploaded
  );
  const headings = extractHeadings(markdown);

  return { compressed, headings };
};
