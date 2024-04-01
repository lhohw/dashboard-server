export const dateRegex =
  /^(\d{2}|\d{4})[-.\\/](\d{1,2})[-.\\/](\d{1,2})(T(\d{2}):(\d{2}):(\d{2}).\d+Z)?$/;

export const dateSeperatorRegex = /-|\.|\//g;

export const frontmatterRegex =
  /^---\n\s*([\-\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)_=+\{\}\[\]\\\|;':",.<>]*)\n\s*---\n?/;

export const markdownSerializerRegex =
  /style="[\d\w:\s\-#;]*"|<!--[\d\w\s가-힣ㄱ-ㅎㅏ-ㅣ!@#$%^&*\(\)-=_+\[\]\{\}\\|;':",./<>?`~]*-->|## 참고\n\s*[-<>\[\]\(\)\{\}!@#\$%\^&\*_=\+;':",.\/\?\\\|\w\d\s가-힣ㄱ-ㅎㅏ-ㅣ]*$/g;

export const inlineStyleRegex = /"?([-\w]+)\s*:\s*([\w\d'"#.\[\]\-]*);?"?/g;

export const referenceRowRegex =
  /- ([-<>\[\]\(\)\{\}!@#\$%\^&\*_=\+;':",.\/\?\\\|\w\d가-힣ㄱ-ㅎㅏ-ㅣ]*)\n?/g;
