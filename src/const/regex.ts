import { getCharRegex } from "utils/regex";

export const numberRegex = /\d/;
export const englishLowerRegex = /a-z/;
export const englishUpperRegex = /A-Z/;
export const koreanRegex = /가-힣ㄱ-ㅎㅏ-ㅣ/;
export const spaceRegex = /\s/;
export const specialCharRegex = /`!@#%&_=;:,<.>~\$\*\^\+\/\?\\\|\-/;
export const charRegex = getCharRegex();
export const bracketRegex = /\[\]\(\)\{\}/;
export const quotationMarkRegex = /'"/;

export const frontmatterRegex = new RegExp(
  `^---\\n\\s*((?:[${charRegex.source}]+)\\s*:\\s*(?:[${charRegex.source}${spaceRegex.source}${bracketRegex.source}${quotationMarkRegex.source}]*\n\\s*))+\\s*---[\n]?`
);

/**
 * @example
 * width: 30
 * height: "30px"
 * -webkit-animation-delay: 2s
 */
export const inlineStylePropertyRegex =
  /((?:-?[a-zA-z])+):\s*([a-z0-9#\[\]\-\(\),\s%.]+)[;]?/;
export const inlineStyleRegex = new RegExp(
  `style="((?:\\s*${inlineStylePropertyRegex.source})+)"`
);

/**
 * regex for JSX style property
 *
 * @example
 *  <div
 *    style={{
 *      width: 30,
 *      height: "30px",
 *      color: "#fafed1",
 *      WebkitAlignItems: "flex-start",
 *      MozAnimationDelay: "-moz-initial",
 *      background: "hsla(128, 30%, 72%, 0.12)"
 *    }}
 *  />
 */
export const JSXStylePropertyRegex =
  /((?:[A-Z]?[a-z]+)+)\s*:\s*(?:'|")?([\sa-zA-Z0-9#%.,\(\)\-]+)(?:'|")?/;
export const JSXStyleRegex = new RegExp(
  `style={{((?:\\s*${JSXStylePropertyRegex.source}[,]?)+)\\s*}}`
);

/**
 * @example
 * <!-- ... -->
 */
export const commentRegex = new RegExp(
  `<!--([${charRegex.source}${bracketRegex.source}${quotationMarkRegex.source}\\s]*)-->`
);

/**
 * @example
 * ## 참조
 * - https://...
 * - [title](link)
 */
export const referenceRegex = new RegExp(
  `## 참조\n\\s*(?:- [${charRegex.source}${bracketRegex.source}]+\n?[ ]*)+`
);

/**
 * @example
 * [title](link)
 */
export const linkRegex = new RegExp(
  `\\[\([${charRegex.source}\\(\\)\\{\\}\\s]+\)\\]\\(\([${charRegex.source}\\(\\)\\{\\}]+\)\\)`
);

export const mdRegex = new RegExp(`.md(#[${charRegex.source}]+)\?`);

export const markdownSerializerRegex = new RegExp(
  [inlineStyleRegex, commentRegex, referenceRegex, linkRegex]
    .map((regex) => regex.source)
    .join("|"),
  "g"
);

export const srcRegex = new RegExp(
  `src="([${charRegex.source}]+).(jp[e]?g|png|svg|avif|webp)"`
);
export const base64SrcRegex =
  /src="data:image\/(jp[e]?g|png|svg|avif|webp);base64,([A-Za-z0-9\+\/=]+)"/;

export const titleRegex = new RegExp(
  `title="([${charRegex.source}${bracketRegex.source}\\s]+)"`
);
export const altRegex = new RegExp(
  `alt="([${charRegex.source}${bracketRegex.source}\\s]+)"`
);

export const imgPropsRegexSource = [
  srcRegex,
  titleRegex,
  altRegex,
  inlineStyleRegex,
]
  .map((regex) => "\\s*" + regex.source)
  .join("|");

export const imgRegex = new RegExp(
  `<img ((?:\\s*(?:${srcRegex.source}|${titleRegex.source}|${altRegex.source}|${inlineStyleRegex.source}|${base64SrcRegex.source}|${JSXStyleRegex.source}))+)\\s*/?>`
);

export const headingRegex = new RegExp(
  `^([#]+) ([${charRegex.source}${bracketRegex.source}${quotationMarkRegex.source} ]+)$`,
  "m"
);
