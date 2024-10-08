import path from "path";
import {
  imgRegex,
  inlineStylePropertyRegex,
  linkRegex,
  markdownSerializerRegex,
  mdRegex,
  srcRegex,
} from "const/regex";
import { resizeImage } from "utils/image";
import { toBase64 } from "utils/serialize";
import { toCamelCase } from "utils/string";
import { getPath } from "utils/path";

/**
 * apply transforms to markdown to be compatible with client
 * */
export const transform = (text: string, category: string) => {
  return text.replace(markdownSerializerRegex, (matched) => {
    return handleMatched(matched, category);
  });
};

const handleMatched = (matched: string, category: string) => {
  if (isComment(matched)) return "";
  if (isStyle(matched)) return inlineStyleToJSX(matched);
  if (isReference(matched)) return transformReference(matched);
  if (isLink(matched)) return transformLink(matched, category);
  throw new Error(`serialization failed\n${matched}`);
};

const isComment = (text: string) => text.startsWith("<!--");
const isStyle = (text: string) => text.startsWith("style");
const isReference = (text: string) => text.startsWith("## 참조");
const isLink = (text: string) => text.startsWith("[");

export const inlineStyleToJSX = (text: string) => {
  let json = "";

  const globalRegex = new RegExp(inlineStylePropertyRegex, "g");
  const matched = text.matchAll(globalRegex);

  for (let [, key, value] of matched) {
    if (key === undefined || value === undefined) continue;

    key = toCamelCase(key);
    if (isNaN(+value)) value = `'${value}'`;
    json += ` ${key}: ${value},`;
  }

  return `style={{${json} }}`;
};

/**
 * add link to reference if has URL only
 * - https://... -> [https://...](https://...)
 * */
export const transformReference = (text: string) => {
  const splitted = text.split(/\n\s*/).filter((e) => !!e.trim());
  const heading = splitted.shift();

  let ret = `${heading}\n`;
  ret += splitted.map(addLinkIfURLOnly).join("\n");
  if (text.endsWith("\n")) ret += "\n";

  return ret;
};

const addLinkIfURLOnly = (reference: string) => {
  reference = reference.trim();
  if (reference.startsWith("- [")) return reference;

  const url = reference.substring(1).trim();
  return `- [${url}](${url})`;
};

export const transformAllImage = async (text: string): Promise<string> => {
  const globalRegex = new RegExp(imgRegex, "mg");
  let matched;

  while ((matched = globalRegex.exec(text))) {
    const matchedStr = matched[0];
    let source = matchedStr;

    if (!hasClosingTag(source)) source = addClosingTag(source);
    source = source.replace(srcRegex, `src="${await srcToBase64(source)}"`);
    text = text.replace(matchedStr, source);
  }

  return text;
};

const hasClosingTag = (source: string) => source.endsWith("/>");

/**
 * add HTML closing tag if not exist or insufficient(only >)
 */
export const addClosingTag = (text: string) => {
  return text.replace(/[\/>]*$/, "/>");
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
  const imagePath = getPath("image", `${filename}.${ext}`);
  const img = Bun.file(imagePath);
  const buf = await img.arrayBuffer();
  const resized = await resizeImage(buf);
  const base64 = toBase64(resized);

  return `data:image/${ext};base64,${base64}`;
};

/**
 * transform link
 * from md reference hash (.md#hash)
 * to production URL (/post?category=${cat}&slug=${slug})
 * */
export const transformLink = (text: string, category: string) => {
  const [, title, src] = text.match(linkRegex)!;

  if (src.startsWith("http") || src.startsWith("#")) return text;

  const route = path.join(`${category}`, src);
  let [cat, slug] = route.split("/");
  if (!cat || !slug)
    throw new Error(`invalid - ${text}\ncategory: ${cat} | slug: ${slug}`);

  const matched = slug.match(mdRegex);
  if (matched) {
    const matchStr = matched[0];
    const hash = matched[1] || "";
    slug = slug.replace(matchStr, hash);
  }

  return `[${title}](/post?category=${cat}&slug=${slug})`;
};
