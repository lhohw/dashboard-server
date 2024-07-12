import {
  imgRegex,
  inlineStyleRegex,
  markdownSerializerRegex,
  srcRegex,
} from "const/regex";
import { resizeImage } from "utils/image";
import { toBase64 } from "utils/serialize";
import { toCamelCase } from "utils/string";

/**
 * Mulitple responsibility for performance reason
 * remove comment | inline style to JSX | transform reference
 * */
export const transform = (text: string) => {
  return text.replace(markdownSerializerRegex, (matched) => {
    if (isComment(matched)) return "";
    if (isStyle(matched)) return inlineStyleToJSX(matched);
    if (isReference(matched)) return transformReference(matched);
    throw new Error(`serialization failed\n${matched}`);
  });
};

const isComment = (text: string) => text.startsWith("<!--");
const isStyle = (text: string) => text.startsWith("style");
const isReference = (text: string) => text.startsWith("## 참조");

export const inlineStyleToJSX = (text: string) => {
  let json = "";
  let m;
  while ((m = inlineStyleRegex.exec(text))) {
    let [, key, value] = m;
    if (key === undefined || value === undefined) continue;
    key = toCamelCase(key);
    if (isNaN(+value)) value = `'${value}'`;
    json += ` ${key}: ${value},`;
  }
  return `style={{${json} }}`;
};

export const transformReference = (text: string) => {
  const hasNewLine = text.endsWith("\n");
  const splitted = text.split(/\n\s*/).filter((e) => !!e.trim());
  const heading = splitted.shift();
  return (
    heading +
    "\n" +
    splitted
      .map((row) => {
        row = row.trim();
        if (row.startsWith("- [")) return row;
        const url = row.substring(1).trim();
        return `- [${url}](${url})`;
      })
      .join("\n") +
    (hasNewLine ? "\n" : "")
  );
};

export const transformAllImage = async (text: string): Promise<string> => {
  try {
    text = await transformImage(text);
    return transformAllImage(text);
  } catch (e) {
    return text;
  }
};

export const transformImage = async (text: string) => {
  let image = text.match(imgRegex)?.[0];
  if (!image) throw new Error("source not matched");

  if (!image.endsWith("/>")) {
    console.log(`\n-- closing tag added --\n${image.trim()}\n`);
    text = text.replace(image, addClosingTag(image));
  }

  const matched = image.match(srcRegex);
  if (!matched) throw new Error("source not matched");

  const [matchedStr, src, ext] = matched;
  const splitted = src.split("/");
  const filename = splitted.pop()!;
  const img = Bun.file(`${process.cwd()}/assets/images/${filename}.${ext}`);
  const buf = await img.arrayBuffer();
  const resized = await resizeImage(buf);
  const base64 = toBase64(resized);

  return text.replace(matchedStr, `src="data:image/webp;base64,${base64}"`);
};

export const addClosingTag = (text: string) => {
  return text.replace(/[\/>]*$/, "") + "/>";
};
