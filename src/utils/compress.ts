export const compress = (data: string) => {
  return Bun.gzipSync(data);
};

export const decompress = (asset: Uint8Array) => {
  const decompressed = Bun.gunzipSync(asset);
  const decoder = new TextDecoder("utf-8");
  const decoded = decoder.decode(decompressed);
  return decoded;
};
