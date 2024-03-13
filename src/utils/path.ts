import path from "path";

const markdownPath = path.join(__dirname, "../markdown/");
const assetPath = path.join(__filename, "../markdown/");

export type PathTargets = "markdown" | "assets";
export const getPath = (target: PathTargets) => {
  if (target === "markdown") return markdownPath;
  else if (target === "assets") return assetPath;
  throw new Error(`${target} is invalid`);
};
