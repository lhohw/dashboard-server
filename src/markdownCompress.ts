import CustomError from "class/CustomError";
import { compress } from "utils/compress";
import { fetchMarkdown, getFileName, isExist, writeFile } from "utils/fetch";
import { log, error, br } from "utils/logger";

const added: string[] = [];
const amended: string[] = [];

const markdownCompress = async (filename: string) => {
  try {
    filename = getFileName(filename);
    const text = await fetchMarkdown(filename);
    const compressed = compress(text);

    const isAmend = isExist(filename);
    await writeFile(filename, compressed);
    add(isAmend, filename);
  } catch (err) {
    const customError = new CustomError(err as Error);
    error(`\nError >> ${filename}: ${customError.message}\n`);
  }
};

const add = (isAmend: boolean, filename: string) => {
  if (isAmend) amended.push(filename);
  else added.push(filename);
  log(`${filename} is ${isAmend ? "amended" : "added"}`);
  br();
};

export const printTransformed = () => {
  log(`new files: [ ${added.join(" ")} ]`);
  log(`amended files: [ ${amended.join(" ")} ]`);
  br();
};

export default markdownCompress;
