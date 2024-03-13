import { getPath } from "utils/path";
import CustomError from "class/CustomError";

export const fetchData = async (filename: string) => {
  filename = getFileName(filename);
  const markdownPath = getPath("markdown");
  const file = Bun.file(`${markdownPath}${filename}`);
  const text = await file.text();
  return text;
};

export const getFileName = (name: string, ext = "md") => {
  if (name.endsWith(`.${ext}`)) return name;
  return `${name}.${ext}`;
};

export const isExist = async (filename: string) => {
  try {
    const file = Bun.file(`./assets/${filename}`);
    const text = await file.text();
    console.log(text);
    return false;
  } catch (error) {
    const customError = new CustomError(error as Error);
    console.log(`\nError >> ${filename}: ${customError.message}\n`);
  }
  return true;
};

export const writeFile = (
  name: string,
  compressed: Uint8Array,
  isAmend: boolean
) => {
  console.log(`write to ${name}`);
};
