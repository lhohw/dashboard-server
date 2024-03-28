import { markdownPath } from "const/path";
import { compress } from "utils/compress";
import { join } from "node:path";

const compressMarkdown = async (category: string, slug: string) => {
  const path = join(markdownPath, category, slug + ".md");
  const file = Bun.file(path);
  const text = await file.text();
  const compressed = compress(text);
  return compressed;
};

export default compressMarkdown;
