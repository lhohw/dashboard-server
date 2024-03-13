import CustomError from "class/CustomError";
import { decompress } from "utils/compress";
import { fetchAsset, getFileName } from "utils/fetch";
import { error, log } from "utils/logger";

const readAsset = async (filename: string) => {
  try {
    filename = getFileName(filename);
    log(`-------------------filename: ${filename}--------------`);
    const asset = await fetchAsset(filename);
    const decompressed = decompress(asset);
    log(decompressed);
  } catch (err) {
    const customError = new CustomError(err as Error);
    error(`\nError >> ${filename}: ${customError.message}\n`);
  }
};

export default readAsset;
