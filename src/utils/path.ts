import _path from "path";

const { ASSET_PATH, NODE_ENV } = process.env;
const mode: "test" | "draft" | "published" =
  NODE_ENV === "test" ? "test" : "draft";
const assetPath = `${ASSET_PATH}/${mode}/`;

const markdownPath = `${assetPath}/markdowns`;

export const getPostPath = (...path: string[]) => {
  return _path.join(markdownPath, ...(path || []));
};
