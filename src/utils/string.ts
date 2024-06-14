export const toCamelCase = (text: string) => {
  return text.replace(/-\w/g, (matched) => matched[1].toUpperCase());
};
