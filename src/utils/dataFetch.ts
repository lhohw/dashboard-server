import fs from "fs";
import { getPath } from "utils/path";

export const getFileName = (name: string, ext = "md") => {
  if (name.endsWith(`.${ext}`)) return name;
  return `${name}.${ext}`;
};

export const fetchMarkdown = async (filename: string) => {
  const markdownPath = getPath("markdown");
  const file = Bun.file(`${markdownPath}${filename}`);
  const text = await file.text();
  return text;
};

export const fetchAsset = async (filename: string) => {
  const assetsPath = getPath("assets");
  const file = Bun.file(`${assetsPath}${filename}`);
  const arrayBuffer = await file.arrayBuffer();
  return arrayBuffer;
};

export const isExist = (filename: string) => {
  const assetsPath = getPath("assets", filename);
  return fs.existsSync(assetsPath);
};

export const writeFile = async (filename: string, compressed: Uint8Array) => {
  const assetsPath = getPath("assets", filename);
  await Bun.write(assetsPath, compressed);
};
