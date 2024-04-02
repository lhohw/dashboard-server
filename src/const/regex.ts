export const dateRegex =
  /^(\d{2}|\d{4})[-.\\/](\d{1,2})[-.\\/](\d{1,2})(T(\d{2}):(\d{2}):(\d{2}).\d+Z)?$/;

export const dateSeperatorRegex = /-|\.|\//g;

export const frontmatterRegex =
  /^---\n\s*([\-\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)_=+\{\}\[\]\\\|;':",.<>]*)\n\s*---\n?/;

export const inlineStyleRegex = /"?([-\w]+)\s*:\s*([\w\d'"#.\[\]\-]*);?"?/g;

export const styleRegex = /style="[\d\w:\s\-#;]*"/g;

export const commentRegex =
  /<!--[\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)-=_+\[\]\{\}\\|;':",./<>?`~]*-->/g;

export const referenceRegex =
  /## 참조\n\s*(?:- [<>\[\]\(\)\{\}!@#\$%\^&\*\-_=\+;':",.\/\?\\\|\w\d가-힣ㄱ-ㅎㅏ-ㅣ]+\n?[ ]*)+/g;

export const tableRegex =
  /\s*(?:\|[\s\d\w가-힣ㄱ-ㅎㅏ-ㅣ_\-,.!@#$%^&\*\(\)\[\]\{\}\+\\;':",./\?]*)+\|\n\s*(?:\|[-\s]+)+\|\n\s*(?:\|[\s\d\w가-힣ㄱ-ㅎㅏ-ㅣ_\-,.!@#$%^&\*\(\)\[\]\{\}\+\\;':",./\?]*)+/g;

export const markdownSerializerRegex = new RegExp(
  [styleRegex, commentRegex, referenceRegex, tableRegex]
    .map((regex) => regex.source)
    .join("|"),
  "g"
);
