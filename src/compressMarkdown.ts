import { compress } from "utils/compress";
import { fetchMarkdown, getFileName } from "utils/dataFetch";

const compressMarkdown = async (filename: string) => {
  filename = getFileName(filename);
  const text = await fetchMarkdown(filename);
  const compressed = compress(text);
  return compressed;
};

export default compressMarkdown;
