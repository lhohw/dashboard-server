import {
  numberRegex,
  bracketRegex,
  englishLowerRegex,
  englishUpperRegex,
  koreanRegex,
  quotationMarkRegex,
  spaceRegex,
  specialCharRegex,
  JSXStylePropertyRegex,
} from "const/regex";

export const getSpecialCharRegex = (
  options: Partial<Record<"bracket" | "quotationMark", boolean>> = {
    bracket: false,
    quotationMark: false,
  }
) => {
  let regex = specialCharRegex.source;

  if (options.bracket) regex += bracketRegex.source;
  if (options.quotationMark) regex += quotationMarkRegex.source;

  return new RegExp(regex);
};

export type GetCharRegexOptions = Partial<{
  /** 0-9 */
  number: boolean;
  /** 가-힣 ㄱ-ㅎ ㅏ-ㅣ */
  korean: boolean;
  /** lower: a-z / upper: A-Z (default is { lower: true, upper: true }) */
  english: boolean | Record<"lower" | "upper", boolean>;
  /** \r \n \t " " */
  space: boolean;
  /** bracket: [] {} () / quotationMark: " ' (default is { bracket: false, upper: false }) */
  special: boolean | Record<"bracket" | "quotationMark", boolean>;
}>;
export const getCharRegex = (
  options: GetCharRegexOptions = {
    number: true,
    korean: true,
    english: true,
    space: false,
    special: true,
  }
) => {
  let regex = "";

  if (options.number) regex += numberRegex.source;

  if (options.korean) regex += koreanRegex.source;

  if (options.english) {
    let engOptions = { lower: true, upper: true };

    if (typeof options.english === "object") {
      engOptions = options.english;
    }

    if (engOptions.lower) regex += englishLowerRegex.source;
    if (engOptions.upper) regex += englishUpperRegex.source;
  }

  if (options.space) regex += spaceRegex.source;

  if (options.special) {
    regex += specialCharRegex.source;

    let specialCharOptions = { bracket: false, quotationMark: false };

    if (typeof options.special === "object") {
      specialCharOptions = options.special;
    }

    if (specialCharOptions.bracket) regex += bracketRegex.source;
    if (specialCharOptions.quotationMark) regex += quotationMarkRegex.source;
  }

  return new RegExp(regex);
};

/**
 * expect style is like
 * width: 30,
 * height: "30px",
 */
export const parseJSXStyleStringToMap = (style: string) => {
  const map = new Map();
  const splitted = style
    .trim()
    .split(/\n/)
    .map((p) => p.trim());

  for (let i = 0; i < splitted.length; i++) {
    let property = splitted[i];
    if (property.endsWith(",")) property = property.slice(0, -1);

    const matched = property.match(JSXStylePropertyRegex);
    if (!matched) continue;

    const [, key, value] = matched;
    map.set(key, value);
  }

  return map;
};

export const parseFrontmatterToMap = (frontmatter: string) => {
  const map = new Map();
  const splitted = frontmatter
    .trim()
    .split(/\n/)
    .map((f) => f.trim());

  const splitRegex = /\s*:\s*/;
  for (let i = 0; i < splitted.length; i++) {
    const row = splitted[i];
    const [key, value] = row.split(splitRegex);
    if (!key || !value) continue;

    map.set(key, value);
  }

  return map;
};
