export const compress = (data: string) => {
  return Bun.gzipSync(data);
};
