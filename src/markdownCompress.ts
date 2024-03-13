import CustomError from "class/CustomError";
import { compress } from "utils/compress";
import { fetchData, getFileName, isExist, writeFile } from "utils/fetch";

const added: string[] = [];
const amended: string[] = [];

const markdownCompress = async (filename: string) => {
  try {
    filename = getFileName(filename);
    const text = await fetchData(filename);
    const compressed = compress(text);

    const isAmend = await isExist(filename);
    writeFile(filename, compressed, isAmend);
    add(isAmend, filename);
  } catch (error) {
    const customError = new CustomError(error as Error);
    console.log(`\nError >> ${filename}: ${customError.message}\n`);
  }
};

const add = (isAmend: boolean, filename: string) => {
  if (isAmend) amended.push(filename);
  else added.push(filename);
  const state = isAmend ? "amended" : "added";
  console.log(`${filename} is ${state}`);
};

export const printTransformed = () => {
  console.log(`new files: [ ${added.join(" ")}]`);
  console.log(`amended files: [ ${amended.join(" ")}]`);
};

export default markdownCompress;
