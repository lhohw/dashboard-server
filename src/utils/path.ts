import type { Mode } from "const/mode";
import Argv from "class/Argv";
import { join } from "path";
import { statSync } from "fs";

const argv = Argv.init();

const { ASSET_PATH, NODE_ENV } = process.env;

const mode: Mode =
  (argv.get("mode") as Mode) || (NODE_ENV === "test" ? "test" : "draft");
const markdownPath = `${ASSET_PATH}/${mode}/markdowns`;

export const getPostPath = (...path: string[]) => {
  return join(markdownPath, ...(path || []));
};

export const getImagePathFromMarkdown = (
  category: string,
  slug: string,
  path: string
): string => {
  const mdPath = join(markdownPath, category, slug);

  try {
    const stats = statSync(mdPath);

    if (stats.isDirectory()) {
      return join(mdPath, path);
    } else {
      return join(mdPath, "../", path);
    }
  } catch (e) {
    if (!mdPath.endsWith(".md")) {
      return getImagePathFromMarkdown(category, slug + ".md", path);
    }

    throw new Error("invalid path: " + e);
  }
};
