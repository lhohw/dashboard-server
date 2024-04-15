import sharp from "sharp";

export const resizeImage = async (
  img: ArrayBuffer,
  width = 2560,
  height = 1600,
  format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo = "webp"
) => {
  const sh = sharp(img);
  const metadata = await sh.metadata();
  let ratio = 16 / 10;
  if (metadata.width && metadata.height) {
    ratio = metadata.width / metadata.height;
    if (width > metadata.width) {
      width = metadata.width;
    }
    height = Math.ceil(width / ratio);
  }

  const resized = sh
    .resize(width, height, {
      fit: "contain",
    })
    .toFormat(format);

  const buf = await resized.toBuffer();
  return buf;
};
