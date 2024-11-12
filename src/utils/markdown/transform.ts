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
import { getImagePathFromMarkdown } from "utils/path";
import ImageUploader from "class/imageUploader";
import type { UploadApiOptions } from "cloudinary";
import { extractImgMarkups } from "./extract";

/**
 * transform markdowns to be compatible with client
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

export const transformAllImage = async (
  text: string,
  category: string,
  slug: string,
  isUploaded?: boolean
): Promise<string> => {
  const matched = extractImgMarkups(text);

  for (const imgStr of matched) {
    let transformedImgStr = imgStr;
    if (!hasClosingTag(imgStr)) transformedImgStr = addClosingTag(imgStr);

    const replaced = await replaceSrcForCloud(
      transformedImgStr,
      category,
      slug,
      isUploaded
    );

    text = text.replace(imgStr, replaced);
  }

  return text;
};

const hasClosingTag = (imgMarkupStr: string) => imgMarkupStr.endsWith("/>");

/**
 * add HTML closing tag if not exist or insufficient(only >)
 */
export const addClosingTag = (text: string) => {
  return text.replace(/[\/>]*$/, "/>");
};

export const replaceSrcToBase64 = async (
  imgMarkupStr: string,
  category: string,
  slug: string
) => {
  const matched = imgMarkupStr.match(srcRegex);

  if (!matched) {
    throw new Error("src is not matched to srcRegex");
  }

  const [, src, ext] = matched;

  const path = getImagePathFromMarkdown(category, slug, `${src}.${ext}`);
  const img = Bun.file(path);

  const buf = await img.arrayBuffer();
  const resized = await resizeImage(buf);
  const base64 = toBase64(resized);
  const replaced = imgMarkupStr.replace(
    srcRegex,
    `src="data:image/webp;base64,${base64}"`
  );
  return replaced;
};

export const replaceSrcForCloud = async (
  imgMarkupStr: string,
  category: string,
  slug: string,
  isUploaded?: boolean
) => {
  const matched = imgMarkupStr.match(srcRegex);

  if (!matched) {
    throw new Error("src is not matched to srcRegex");
  }

  const [, src, ext] = matched;

  const path = getImagePathFromMarkdown(category, slug, `${src}.${ext}`);
  const fileName = src.split("/").pop();

  if (!fileName) {
    throw new Error("file name is not defined from src: " + src);
  }

  const img = Bun.file(path);
  const buf = await img.arrayBuffer();
  const resized = await resizeImage(buf);
  const asset_folder = `blhog-posts-images/${category}/${slug}`;

  const imageUploader = new ImageUploader();
  let secure_url: string;

  if (!isUploaded) {
    secure_url = await imageUploader.uploadStream(resized, {
      discard_original_filename: true,
      use_filename: true,
      filename_override: fileName,
      use_asset_folder_as_public_id_prefix: true,
      asset_folder,
    } as UploadApiOptions);
  } else {
    secure_url = await imageUploader.getAssetInfo(
      `${asset_folder}/${fileName}`
    );
  }

  const replaced = imgMarkupStr.replace(srcRegex, `src="${secure_url}"`);
  return replaced;
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
