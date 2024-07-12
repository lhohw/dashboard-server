import path from "path";
import {
  imgRegex,
  inlineStyleRegex,
  linkRegex,
  markdownSerializerRegex,
  mdRegex,
  srcRegex,
} from "const/regex";
import { resizeImage } from "utils/image";
import { toBase64 } from "utils/serialize";
import { toCamelCase } from "utils/string";

/**
 * Mulitple responsibility for performance reason
 * remove comment | inline style to JSX | transform reference | link
 * */
export const transform = (text: string, category: string) => {
  return text.replace(markdownSerializerRegex, (matched) => {
    if (isComment(matched)) return "";
    if (isStyle(matched)) return inlineStyleToJSX(matched);
    if (isReference(matched)) return transformReference(matched);
    if (isLink(matched)) return transformLink(matched, category);
    throw new Error(`serialization failed\n${matched}`);
  });
};

const isComment = (text: string) => text.startsWith("<!--");
const isStyle = (text: string) => text.startsWith("style");
const isReference = (text: string) => text.startsWith("## 참조");
const isLink = (text: string) => text.startsWith("[");

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
  let matched;
  const regex = new RegExp(imgRegex.source, "mg");

  while ((matched = regex.exec(text))) {
    let image = matched[0];
    if (!image.endsWith("/>")) image = addClosingTag(image);
    image = image.replace(srcRegex, `src="${await srcToBase64(image)}"`);
    text = text.replace(matched[0], image);
  }

  return text;
};

export const srcToBase64 = async (source: string) => {
  const matched = source.match(srcRegex);
  if (!matched) {
    console.error("source not matched");
    return source;
  }

  const [, src, ext] = matched;
  const splitted = src.split("/");
  const filename = splitted.pop()!;
  const img = Bun.file(`${process.cwd()}/assets/images/${filename}.${ext}`);
  const buf = await img.arrayBuffer();
  const resized = await resizeImage(buf);
  const base64 = toBase64(resized);

  return `data:image/webp;base64,${base64}`;
};

export const addClosingTag = (text: string) => {
  return text.replace(/[\/>]*$/, "") + "/>";
};

export const transformLink = (text: string, category: string) => {
  const [, title, src] = text.match(linkRegex)!;
  if (src.startsWith("http")) return text;

  const route = path.join(`${category}`, src);
  let [cat, slug] = route.split("/");
  if (!cat || !slug)
    throw new Error(`invalid - ${text}\ncategory: ${cat} | slug: ${slug}`);

  const matched = slug.match(mdRegex);
  if (matched) {
    const hash = matched[1] || "";
    slug = slug.replace(matched[0], hash);
  }

  return `[${title}](/post?category=${cat}&slug=${slug})`;
};
