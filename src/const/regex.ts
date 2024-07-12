export const dateRegex =
  /^(\d{2}|\d{4})[-.\\/](\d{1,2})[-.\\/](\d{1,2})(T(\d{2}):(\d{2}):(\d{2}).\d+Z)?$/;

export const dateSeperatorRegex = /-|\.|\//g;

export const frontmatterRegex =
  /^---\n\s*([\-\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)_=+\{\}\[\]\\\|;':",.<>]*)\n\s*---\n?/;

export const inlineStyleRegex = /"?([-\w]+)\s*:\s*([\w\d'"#.\[\]\-]*);?"?/g;

export const styleRegex = /style="[\d\w:\s\-#;]*"/g;
export const JSXStyleRegex = /style={{[\s\d\w:\-#,']*}}/;

export const commentRegex =
  /<!--[\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)-=_+\[\]\{\}\\|;':",./<>?`~]*-->/g;

export const referenceRegex =
  /## 참조\n\s*(?:- [<>\[\]\(\)\{\}!@#\$%\^&\*\-_=\+;':",.\/\?\\\|\w\d가-힣ㄱ-ㅎㅏ-ㅣ]+\n?[ ]*)+/g;

export const linkRegex =
  /\[([a-zA-Z\d\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*()_+-=\[\\|;':",./<>?₩~`]+)\]\(([./a-z-A-Z\d가-힣`~!@#$%^&*(-=_+\[\]\\|;':",./<>?]+)\)/;
export const mdRegex =
  /.md(#[./a-z-A-Z\d가-힣`~!@#$%^&*(-=_+\[\]\\|;':",./<>?]+)?$/;

export const markdownSerializerRegex = new RegExp(
  [styleRegex, commentRegex, referenceRegex, linkRegex]
    .map((regex) => regex.source)
    .join("|"),
  "g"
);

export const srcRegex =
  /src="([_\-\.@\/\w\d\(\)\[\]\{\},\?]+).(jp[e]?g|png|svg|avif|webp)"/;
export const base64SrcRegex =
  /src="data:image\/(?:jp[e]?g|png|svg|avif|webp);base64,[A-Za-z0-9\+\/=]+"/;
const titleRegex = /title="[_\-\.@\/\w\d!@#\$%\^&\*\(\)\[\]\{\},\?]+"/;
const altRegex = /alt="[_\-\.\@\/\w\d\(\)\[\]\{\},\?가-힣ㄱ-ㅎㅏ-ㅣ\s]+"/;
export const imgPropsRegexSource = [
  srcRegex,
  titleRegex,
  altRegex,
  JSXStyleRegex,
]
  .map((regex) => " " + regex.source)
  .join("|");
export const imgRegex = new RegExp(
  `\\s*<img(${imgPropsRegexSource}| ${base64SrcRegex.source})+\\s*/?>$`,
  "m"
);

export const headingRegex =
  /^([#]+) ([ 가-힣ㄱ-ㅎㅏ-ㅣ0-9a-zA-Z~!@#$%^&*()_+-=\[\]\\|;':",./<>?]+)$/gm;
