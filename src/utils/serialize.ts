import type { Photo, UnsplashPhoto } from "const/definitions";

export const serializeUnsplashPhoto = (photos: UnsplashPhoto[]): Photo[] => {
  try {
    const array = photos.map((res) => {
      const {
        id,
        urls: { raw },
        alt_description,
        blur_hash,
        user: {
          name,
          links: { html },
        },
      } = res;

      return {
        photo_id: id,
        photo_url: raw,
        alt: alt_description,
        blur_hash,
        user_name: name,
        user_link: html,
      };
    });
    return array;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const base64Ch =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const toBase64 = (data: string | number[] | ArrayBuffer): string => {
  if (Array.isArray(data)) data = arrayToAsciiStr(data);
  if (typeof data === "object") data = bufferToAsciiStr(data);

  const len = data.length;
  let base64 = "";
  for (let i = 0; i < Math.floor(len / 3); i++) {
    const bit = strToAsciiBit(data.substring(i * 3, i * 3 + 3));
    base64 += bitToBase64(bit);
  }
  const end = len % 3;
  const padding = end === 1 ? 2 : 1;
  if (end) {
    const bit = strToAsciiBit(data.substring(len - end));
    base64 += bitToBase64(bit << (padding * 8));
    base64 =
      base64.substring(0, base64.length - padding) + "".padEnd(padding, "=");
  }
  return base64;
};

const arrayToAsciiStr = (array: number[]) =>
  array.map((ch) => String.fromCharCode(ch)).join("");

const bufferToAsciiStr = (buffer: ArrayBuffer) =>
  arrayToAsciiStr(Array.from(new Uint8Array(buffer)));

const strToCharCode = (str: string) =>
  str.split("").map((e) => e.charCodeAt(0));

const strToAsciiBit = (str: string) =>
  strToCharCode(str).reduce(
    (acc, num, i) => acc + (num << ((str.length - i - 1) * 8)),
    0
  );

const bitToBase64 = (bit: number) => {
  let str = "";
  for (let shift = 18; shift >= 0; shift -= 6) {
    const mask = 0b111111 << shift;
    str += base64Ch.charAt((bit & mask) >> shift);
  }
  return str;
};
