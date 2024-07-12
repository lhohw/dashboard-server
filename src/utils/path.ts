import path from "path";

const cwd = process.cwd();
const assetPath = path.join(cwd, "assets");
const markdownPath = path.join(assetPath, "markdown");
const imagePath = path.join(assetPath, "images");

export type PathTargets = "markdown" | "image";
export const getPath = (target: PathTargets, ...filename: string[]) => {
  if (target === "markdown")
    return path.join(markdownPath, ...(filename || ""));
  else if (target === "image") return path.join(imagePath, ...(filename || ""));
  throw new Error(`${target} is invalid`);
};
